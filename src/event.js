
// js-utils
// event.js
// https://github.com/jniac/js-utils

export class Event {

	constructor(type) {

		this.type = type

	}

	cancel() {

		this.canceled = true

	}

}

class Listener {

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

		this.callback.call(this.thisArg, event)

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

}

const EventDispatcherPrototype = {

	getListeners({ copy = false } = {}) {

		if (!this.__listeners)
			Object.defineProperty(this, '__listeners', { value: [] })

		return copy ? this.__listeners.concat() : this.__listeners

	},

	getListenerIndexFor(priority, before) {

		let listeners = this.getListeners()

		for (let listener, i = 0; listener = listeners[i]; i++) 
			if ((before && priority >= listener.priority) ||
				(!before && priority > listener.priority))
				return i

		return listeners.length

	},

	dispatchEvent(eventOrType, eventParams = null) {

		if (typeof eventOrType === 'string') {

			let events = eventOrType.split(/(?:\s+)|(?:,\s*)/)

			if (events.length > 1) {

				for (let v of events)
					this.dispatchEvent(v, eventParams)

				return this

			}

		}

		let event = typeof eventOrType === 'string' ? new Event(eventOrType) : eventOrType

		Object.assign(event, eventParams)

		Object.defineProperty(event, 'target', { value: this })

		for (let listener of this.getListeners({ copy: true })) {

			if (listener.test(event.type))
				listener.call(event)

			if (event.canceled)
				break

		}

		for (let listener, listeners = this.getListeners(), i = 0; listener = listeners[i]; i++)
			if (listener.isKilled())
				listeners.splice(i--, 1)

		return this

	},

	addEventListener(type, callback, { priority = 0, insertBefore = false, thisArg = null, max = Infinity } = {}) {

		if (typeof type === 'string') {

			let types = type.split(/(?:\s+)|(?:,\s*)/)

			if (types.length > 1) {

				for(let v of types)
					this.addEventListener(v, callback, { priority, insertBefore, thisArg, max })

				return this

			}

		}

		let listeners = this.getListeners()

		let index = this.getListenerIndexFor(priority, insertBefore)

		listeners.splice(index, 0, new Listener(this, type, callback, priority, max, thisArg))

		return this

	},

	removeAllEventListeners() {

		let listeners = this.getListeners()

		while(listeners.length)
			listeners.pop().kill()

		return this

	},

	removeEventListener(type, callback = null) {

		let listeners = this.getListeners()

		for (let listener, i = 0; listener = listeners[i]; i++) {

			if (listener.type === type && (!callback || callback === listener.callback)) {

				listeners.splice(i--, 1)
				listener.kill()

			}

		}

		return this

	},

}

const EventDispatcherShorthands = {

	on: EventDispatcherPrototype.addEventListener,

	once(type, callback, options = {}) {

		this.addEventListener(type, callback, Object.assign(option, { max: 1 }))

		return this

	},

	off: EventDispatcherPrototype.removeEventListener,

}

export function implementEventDispatcher(target, { applyShortands = true } = {}) {

	for (let k in EventDispatcherPrototype)
		Object.defineProperty(target, k, { value: EventDispatcherPrototype[k] })

	if (applyShortands)
		for (let k in EventDispatcherShorthands)
			Object.defineProperty(target, k, { value: EventDispatcherShorthands[k] })

	Object.defineProperty(target, 'isEventDispatcher', { value: true })

	return target

}

export class EventDispatcher { }

implementEventDispatcher(EventDispatcher.prototype)


