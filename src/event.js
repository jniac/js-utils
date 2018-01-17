/**
 * event.js module
 * a very permissive event module, with great options
 * second version built on WeakMap
 * inspired by jQuery (chaining, iterations), express (flexibility) etc.
 *
 *
 *
 * WARNINGS & VULNERABILITIES:
 *
 * • For some unknow reasons a killed Listener is sometimes called or killed (a second time!)
 *       " if (this.killed)
 *            return "
 *       is a good patch, but the bug is not fixed
 *
 * • When removing a listener, if the listener has been added with a "thisArg" 
 *       it could currently be removed without specifying a value for "thisArg" (since off/removeEventListener() could be used with nothing more than a type parameters)
 *       this is dangerous since differents listeners could match the same criteria (two instance of a same class / prototype have striclty equal members 
 *       (because actually belonging to that class / prototype)).
 *       When specifying a callback to removeEventListener AND NOT a thisArg, should be considered as not matching listeners that HAVE a thisArg ?
 * 
 */

const isIterable = obj => obj ? (typeof obj[Symbol.iterator] === 'function') : false

const whitespace = obj => typeof obj === 'string' && /\s/.test(obj)

let weakmap = new WeakMap()

export let weakmapCount = 0

function createListenersArray(target) {

	let listeners = []

	weakmap.set(target, listeners)

	weakmapCount++

	return listeners

}

function deleteListenersArray(target) {

	weakmap.delete(target)

	weakmapCount--

}

export function getAllListeners(target, createMode = false) {

	return weakmap.get(target) || (createMode ? createListenersArray(target) : null)

}

export function getListenersMatching(target, type, callback = null, options = null) {

	let listeners = weakmap.get(target)

	if (!listeners)
		return []

	let result = []

	for (let listener of listeners)
		if (listener.match(type, callback, options))
			result.push(listener)

	return result

}

export function addEventListener(target, type, callback, options = undefined) {

	if (!callback) {

		console.log('event.js: addEventListener callback is null! (ignored)')
		return

	}

	if (isIterable(target)) {

		for (let element of target)
			addEventListener(element, type, callback, options)

		return target

	}

	if (whitespace(type)) {

		for (let sub of type.split(/\s/))
			addEventListener(target, sub, callback, options)

		return target

	}

	let listener = new Listener(getAllListeners(target, true), type, callback, options)

	return target

}

export { addEventListener as on }

export function once(target, type, callback, options = { }) {

	options.max = 1

	return addEventListener(target, type, callback, options)

}

export function removeEventListener(target, type, callback = null, options = { }) {

	if (isIterable(target)) {

		for (let element of target)
			removeEventListener(element, type, callback)

		return target

	}

	if (whitespace(type)) {

		for (let sub of type.split(/\s/))
			removeEventListener(target, type, callback)

		return target

	}

	for (let listener of getListenersMatching(target, type, callback, options))
		listener.kill()

	return target

}

export { removeEventListener as off }

export function clearEventListener(target) {

	let listeners = weakmap.get(target)

	if (!listeners)
		return target

	while(listeners.length)
		listeners.pop().kill()

	deleteListenersArray(target)

	return target

}

export function dispatchEvent(target, event, eventOptions = null) {

	if (!target || !event)
		return target

	if (isIterable(target)) {

		for (let element of target)
			dispatchEvent(element, event, eventOptions)

		return target

	}

	// fast skip test (x20 speed on target with no listeners: 0.0030ms to 0.00015ms)
	if (!weakmap.has(target) && !event.propagateTo && (!eventOptions || !eventOptions.propagateTo))
		return target

	if (typeof event === 'string') {

		if (whitespace(event)) {

			for (let sub of event.split(/\s/))
				dispatchEvent(target, sub, eventOptions)

			return target

		}

		return dispatchEvent(target, new Event(target, event, eventOptions))

	}



	event.currentTarget = target

	// let listeners = getListenersMatching(target, event.type).sort((A, B) => B.priority - A.priority)
	let listeners = getListenersMatching(target, event.type)

	for (let listener of listeners) {

		listener.call(event)

		if (event.canceled)
			break

	}

	if (event.propagateTo)
		dispatchEvent(event.propagateTo(event.currentTarget), event)

	return target

}









const EventOptions = {

	cancelable: true,
	priority: 0,
	propagateTo: null,

}

class Event {

	constructor(target, type, options) {

		options = Object.assign({}, EventOptions, options)

		Object.defineProperty(this, 'target', { 

			value: target,

		})

		Object.defineProperty(this, 'currentTarget', { 

			writable: true,
			value: target,

		})

		Object.defineProperty(this, 'type', {

			enumerable: true,
			value: type,

		})

		for (let k in options) {

			Object.defineProperty(this, k, { 
				
				enumerable: k in EventOptions,
				value: options[k],

			})

		}

		Object.defineProperty(this, 'canceled', {

			writable: this.cancelable,
			value: false,

		})

	}

	cancel() {

		if (this.cancelable)
			this.canceled = true

	}

}



let ListenerDefaultOptions = {

	priority: 0,
	insertFirst: false,

}

class Listener {

	constructor(array, type, callback, options = {}) {

		this.count = 0

		this.array = array
		// this.array.push(this)

		this.type = type
		this.callback = callback

		this.enabled = true

		// options
		Object.assign(this, ListenerDefaultOptions, options)

		let index = this.array.findIndex(listener => this.insertFirst ? 
			listener.priority <= this.priority : 
			listener.priority < this.priority)

		if (index === -1)
			this.array.push(this)
		else
			this.array.splice(index, 0, this)

	}

	match(str, callback = null, options = null) {

		if (options !== null && this.match(str, callback)) {

			for (let k in options)
				if (this[k] !== options[k])
					return false

			return true

		}

		if (callback !== null)
			return this.match(str) && this.callback === callback

		if (this.type instanceof RegExp)
			return this.type.test(str)

		if (this.type instanceof Array)
			return this.type.indexOf(str) !== -1

		if (typeof this.type === 'function')
			return this.type(str)

		return this.type === str

	}

	call(event) {

		if (this.killed)
			return

		this.callback.call(this.thisArg || event.currentTarget, event, ...(this.args || []))

		this.count++

		if (this.count === this.max)
			this.kill()

	}

	kill() {

		if (this.killed)
			return

		let index = this.array.indexOf(this)

		this.array.splice(index, 1)

		delete this.array
		delete this.type
		delete this.callback
		delete this.options

		this.killed = true

	}

}







let EventDispatcherPrototype = {

	getAllListeners(createMode = false) {

		return getAllListeners(this, createMode)

	},

	clearEventListener() {

		return clearEventListener(this)

	},
	
	addEventListener(type, callback, options = undefined) { 

		return addEventListener(this, type, callback, options) 

	},

	on(type, callback, options = undefined) { 

		return addEventListener(this, type, callback, options) 

	},

	once(type, callback, options = { }) { 

		return once(this, type, callback, options) 

	},

	removeEventListener(type, callback = undefined, options = undefined) { 

		return removeEventListener(this, type, callback, options) 

	},

	off(type, callback = undefined, options = undefined) { 

		return removeEventListener(this, type, callback, options) 

	},

	dispatchEvent(event, eventOptions = null) { 

		return dispatchEvent(this, event, eventOptions) 

	},

}







export class EventDispatcher { }

Object.assign(EventDispatcher.prototype, EventDispatcherPrototype)








export function implementEventDispatcher(target, { remap = null } = {}) {

	for (let key in EventDispatcherPrototype) {

		let remapKey = remap ? (typeof remap === 'object' ? (remap[key] || key) : remap(key)) : key

		if (remapKey)
			Object.defineProperty(target, remapKey, { value: EventDispatcherPrototype[key] })

	}

	return target

}





