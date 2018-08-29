
let register = (() => {

    let objectMap = new WeakMap()

    let stringMap = new Map()

    let isObject = target => target && typeof target === 'object'

    return {

        get: target => (

			isObject(target)

				? objectMap.get(target)

				: stringMap.get(target)

		),

        set: (target, value) => {

			isObject(target)

				? objectMap.set(target, value)

				: stringMap.set(target, value)

        },

        delete: (target) => {

			isObject(target)

                ? objectMap.delete(target)

                : stringMap.delete(target)

        },

        reset: () => {

            objectMap = new WeakMap()
            stringMap.clear()
            console.info('Listen has been reset')

        },

    }

})()

const SPLIT = /\s*,\s*|\s+/

const filterMatches = (filter, type) => {

	if (filter === '*') {

		return true

	}

	if (typeof filter === 'string' && SPLIT.test(filter)) {

		return filter.split(SPLIT).includes(type)

	}

	if (filter instanceof RegExp) {

		return filter.test(type)

	}

	if (Array.isArray(filter)) {

		return filter.some(value => filterMatches(value, type))

	}

	return type === filter

}

const getFilterMatch = (filter) => {

	if (filter === '*') {

		return () => true

	}

	if (typeof filter === 'string' && SPLIT.test(filter)) {

		let array = filter.split(SPLIT)

		return type => array.includes(type)

	}

	if (filter instanceof RegExp) {

		return type => filter.test(type)

	}

	if (Array.isArray(filter)) {

		return type => filter.some(filter => filterMatches(filter, type))

	}

	return type => type === filter

}

const clear = (target) => {

	register.delete(target)

}

const ensure = (target) => {

	let array = register.get(target)

	if (!array) {

		register.set(target, array = [])

	}

	return array

}

const EMPTY_ARRAY = []
let listenerCount = 0

const add = (target, filter, callback, { thisArg = null, args = EMPTY_ARRAY, priority = 0, key = null } = {}) => {

	let match = getFilterMatch(filter)

	if (Array.isArray(callback)) {

		thisArg = callback[0]
		callback = thisArg[callback[1]]

	}

	let listener = { filter, match, callback, thisArg, args, priority, key }

    Object.defineProperty(listener, 'uid', { value: listenerCount++, enumerable: true })

	let array = ensure(target)

	let index = 0

	while (index < array.length) {

		if (priority > array[index].priority)
			break

		index++

	}

	array.splice(index, 0, listener)

}

const ALL = Symbol('Listen.ALL')

const remove = (target, filter = '*', callback = ALL, { uid = -1, thisArg = null, key = null } = {}) => {

	let array = register.get(target)

	if (!array)
		return

	if (Array.isArray(callback)) {

		thisArg = callback[0]
		callback = thisArg[callback[1]]

	}

	for (let i = 0, { length } = array; i < length; i++) {

		let listener = array[i]

		let match

        if (uid === listener.uid) {

            match = true

        } else {

            match = filter === '*' || listener.filter === filter

    		if (match && callback !== ALL)
    			match = callback === listener.callback

    		if (match && thisArg)
    			match = thisArg === listener.thisArg

    		if (match && key)
    			match = key === listener.key

        }

		if (match) {

            listener.killed = true
			array.splice(i, 1)
			i--
			length--

		}

	}

    if (array.length === 0) {

        register.delete(target)

    }

}

let currentType, currentCancel

const current = Object.defineProperties({}, {

	type: { get: () => currentType, enumerable: true },
	cancel: { get: () => currentCancel, enumerable: true },

})

const KILL = Symbol('Listen.KILL')

const call = (target, type, ...callArgs) => {

	if (SPLIT.test(type)) {

		type = type.split(SPLIT)

	}

	if (Array.isArray(type)) {

		for (let _type of type)
			call(target, _type, ...callArgs)

		return

	}

	let array = register.get(target)

	if (!array)
		return

    // do not forget to copy the array or you will get into (big) troubles!
	array = [...array]

	let canceled = false
	let cancel = () => canceled = true

	for (let listener of array) {

		if (canceled)
			break

        let { match, callback, thisArg, args } = listener

        currentType = type
        currentCancel = cancel

        let doesMatch = match(type)
        let killed = doesMatch && callback.call(thisArg, ...args, ...callArgs) === KILL

        if (killed)
            remove(target, null, null, { uid: listener.uid })

	}

}

const waitFor = (target, key) => new Promise(resolve => {

    Listen.add(target, key, () => {

        resolve(currentType)

        return KILL

    })

})

export default {

    ALL,
    KILL,

	add,
	remove,
	call,
    waitFor,

	current,

	debug: (target) => register.get(target),
    reset: () => register.reset(),

}
