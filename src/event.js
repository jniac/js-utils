
// js-utils
// event.js
// https://github.com/jniac/js-utils

function isIterable(obj) {

	return obj && Symbol && typeof obj[Symbol.iterator] === 'function'

}

function iterate(target, callback) {

	if (isIterable(target)) {

		for (let object of target)
			callback(object)

	} else {

		callback(target)

	}

}

export class Event {

	constructor(type, options) {

		Object.defineProperties(this, {

			type: { value: type },
			options: { value: options },

		})

	}

	clone() {

		let event = new Event(this.type, this.options)

		return Object.assign(event, this)

	}

	initTarget(target, currentTarget = null) {

		Object.defineProperties(this, {

			target: { 
			
				value: target,
			
			},

			currentTarget: {

				writable: true,
				value: currentTarget || target,

			},

		})

		return this

	}

	cancel() {

		this.canceled = true

	}

	toString() {

		return `Event{ type: ${this.type} }`

	}

}

class EventListener {

	constructor(eventDispatcher, type, callback, priority, maxCount, thisArg) {

		this.eventDispatcher = eventDispatcher
		this.type = type
		this.callback = callback
		this.priority = priority
		this.maxCount = maxCount
		this.thisArg = thisArg
		this.count = 0

	}

	test(type) {

		if (this.disabled)
			return false

		if (type === 'all')
			return true

		if (this.type instanceof RegExp)
			return this.type.test(type)

		return this.type === type

	}

	call(event) {

		try {

			this.callback.call(this.thisArg, event)

		} catch(e) {

			console.error(e)

		}

		if (++this.count >= this.maxCount)
			this.kill()

	}

	kill() {

		for (let k in this)
			delete this[k]

	}

	isKilled() {

		return !this.eventDispatcher && !this.type && !this.callback

	}

	toString() {

		return `EventListener { type: ${this.type}, priority: ${this.priority}, count: ${this.count} }`
		
	}

}

export const listenersKey = typeof Symbol === 'undefined' ? '__listeners' : Symbol('eventListeners')

const Prototype = {

	getEventListeners({ createIfNull = false, copy = false, type = null } = {}) {

		if (!this[listenersKey]) {

			if (!createIfNull)
				return []

			Object.defineProperty(this, listenersKey, { 

				configurable: true,
				value: [],

			})

		}

		if (type && typeof type === 'string')
			return this[listenersKey].filter(listener => listener.type === type)

		if (type && (type) instanceof RegExp)
			return this[listenersKey].filter(listener => type.test(listener.type))

		return copy ? this[listenersKey].concat() : this[listenersKey]

	},

	getListenerIndexFor(priority, before) {

		let listeners = Prototype.getEventListeners.call(this)

		for (let listener, i = 0; listener = listeners[i]; i++) 
			if ((before && priority >= listener.priority) ||
				(!before && priority > listener.priority))
				return i

		return listeners.length

	},

	dispatchEvent(eventOrType, eventParams = null, options = null) {

		// skip if listeners have never been associated AND event will not propagate
		if (!this[listenersKey] && (!options || !options.propagateTo) && (!eventOrType.options || !eventOrType.options.propagateTo))
			return this

		if (typeof eventOrType === 'string') {

			let events = eventOrType.split(/(?:\s+)|(?:,\s*)/)

			if (events.length > 1) {

				for (let v of events)
					Prototype.dispatchEvent.call(this, v, eventParams, options)

				return this

			}

		}

		let event = typeof eventOrType === 'string' ? new Event(eventOrType, options).initTarget(this) : eventOrType

		for (let k in eventParams) {

			if (k === 'target' || 
				k === 'currentTarget' ||
				k === 'type' ||
				k === 'options')
				continue

			event[k] = eventParams[k]

		}

		for (let listener of Prototype.getEventListeners.call(this, { copy: true, createIfNull: false })) {

			if (listener.test(event.type))
				listener.call(event)

			if (event.canceled)
				break

		}

		for (let listener, listeners = Prototype.getEventListeners.call(this, { createIfNull: false }), i = 0; listener = listeners[i]; i++)
			if (listener.isKilled())
				listeners.splice(i--, 1)

		if (!event.canceled && event.options && event.options.propagateTo) {

			let targets = event.options.propagateTo(event.currentTarget) || []

			if (!isIterable(targets))
				targets = [targets]

			for (let target of targets) {

				let event2 = event.clone().initTarget(event.target, target)

				Prototype.dispatchEvent.call(target, event2, eventParams)

			}

		}

		return this

	},

	addEventListener(type, callback, { priority = 0, insertBefore = false, thisArg = null, max = Infinity } = {}) {

		if (typeof type === 'string') {

			let types = type.split(/(?:\s+)|(?:,\s*)/)

			if (types.length > 1) {

				for(let v of types)
					Prototype.addEventListener.call(this, v, callback, { priority, insertBefore, thisArg, max })

				return this

			}

		}

		let listeners = Prototype.getEventListeners.call(this, { createIfNull: true })

		let index = Prototype.getListenerIndexFor.call(this, priority, insertBefore)

		listeners.splice(index, 0, new EventListener(this, type, callback, priority, max, thisArg))

		return this

	},

	clearEventListeners() {

		let listeners = Prototype.getEventListeners.call(this)

		while(listeners.length)
			listeners.pop().kill()

		delete this[listenersKey]

		return this

	},

	removeEventListener(type, callback = null) {

		let listeners = Prototype.getEventListeners.call(this)

		for (let listener, i = 0; listener = listeners[i]; i++) {

			if (String(listener.type) === String(type) && (!callback || callback === listener.callback)) {

				listeners.splice(i--, 1)
				listener.kill()

			}

		}

		return this

	},

}

const Shorthands = {

	on: Prototype.addEventListener,

	once(type, callback, options = {}) {

		Prototype.addEventListener.call(this, type, callback, Object.assign(options, { max: 1 }))

		return this

	},

	off: Prototype.removeEventListener,

}

export function implementEventDispatcher(target, { applyShortands = true, remap = null } = {}) {

	const remapK = typeof remap === 'function' ? remap : (k => remap ? (remap[k] || k) : k)

	for (let k in Prototype)
		Object.defineProperty(target, remapK(k), { value: Prototype[k] })

	if (applyShortands)
		for (let k in Shorthands)
			Object.defineProperty(target, remapK(k), { value: Shorthands[k] })

	return target

}

export class EventDispatcher { }

implementEventDispatcher(EventDispatcher.prototype)






export function on(target, type, callback, options) {

	iterate(target, object => Shorthands.on.call(object, type, callback, options))

	return target

}

export function once(target, type, callback, options) {

	iterate(target, object => Shorthands.once.call(object, type, callback, options))

	return target

}

export function off(target, type, callback, options) {

	iterate(target, object => Shorthands.off.call(object, type, callback, options))

	return target

}

export function dispatchEvent(target, type, eventParams, options) {

	iterate(target, object => Prototype.dispatchEvent.call(object, type, eventParams, options))

	return target

}

export function getEventListeners(target, options) {

	return Prototype.getEventListeners.call(target, options)

}

export function clearEventListeners(target) {

	iterate(target, object => Prototype.clearEventListeners.call(object))

	return target

}




