
function update(stack) {

	let { array, addArray } = stack

	if (addArray.length) {

		stack.count += addArray.length
		array.push(...addArray)
		addArray.length = 0

	}

	if (stack.canceledCount) {

		for (let i = 0, n = array.length; i < n; i++) {

			let { canceled } = array[i]

			if (canceled) {

				destroyObject(...array.splice(i, 1))
				i--
				n--
				stack.count--

			}

		}

		stack.canceledCount = 0

	}

}

function destroyObject(object) {

	for (let key in object)
		delete object[key]

}

function add(stack, callback, thisArg = null, args = null, once = false, condition = null) {

	if (!callback)
		return

	if (stack.locked) {

		stack.addArray.push({ callback, thisArg, args, once, condition })

	} else {

		stack.array.push({ callback, thisArg, args, once, condition })
		stack.count++

	}

}

function remove(stack, callback, thisArg) {

	if (!callback && !thisArg)
		return

	let { array } = stack

	for (let i = 0, n = array.length; i < n; i++) {

		let { callback:currentCallback, thisArg:currentThisArg } = array[i]

		let callbackMatch = !callback || callback === currentCallback
		let thisArgMatch = !thisArg || thisArg === currentThisArg

		if (callbackMatch && thisArgMatch) {

			if (stack.locked) {

				array[i].canceled = true
				stack.canceledCount++

			} else {

				destroyObject(...array.splice(i, 1))
				i--
				n--
				stack.count--

			}

		}

	}

}



export class Stack {

	constructor() {

		this.array = []
		this.addArray = []
		this.count = 0
		this.canceledCount = 0

	}

	/**
	 *
	 * add() allow 2 writings:
	 *   stack.add(this.update, { thisArg: this, args: [...] })
	 * or
	 *   stack.add(this, 'update', ...)
	 *
	 */
	add(callback, { thisArg = null, args = null  } = {}) {

		if (callback && (typeof callback === 'object')) {

			let [object, key, ...args] = arguments

			add(this, object[key], object, args)

			return this

		}

		add(this, callback, thisArg, args)

		return this

	}

	once(callback, { thisArg = null, args = null  } = {}) {

		if (callback && (typeof callback === 'object')) {

			let [object, key, ...args] = arguments

			add(this, object[key], object, args, true)

			return this

		}

		add(this, callback, thisArg, args, true)

		return this

	}

	only(condition, callback, { thisArg = null, args = null  } = {}) {

		if (callback && (typeof callback === 'object')) {

			let [condition, object, key, ...args] = arguments

			add(this, object[key], object, args, false, condition)

			return this

		}

		add(this, callback, thisArg, args, false, condition)

		return this

	}

	remove(callback, { thisArg = null  } = {}) {

		if (callback && (typeof callback === 'object')) {

			let [object, key] = arguments

			remove(this, object[key], object)

			return this

		}

		remove(this, callback, thisArg)

		return this

	}

	execute() {

		let { array } = this

		this.locked = true

		for (let i = 0, n = array.length; i < n; i++) {

			let { callback, thisArg, args, condition, once, canceled } = array[i]

			if (canceled)
				continue

			if (condition && !condition(array[i]))
				continue

			if (callback.apply(thisArg, args) === false || once) {

				array[i].canceled = true
				this.canceledCount++

			}

		}

		this.locked = false

		update(this)

	}

	dump() {

		let { array } = this

		this.locked = true

		for (let { callback, thisArg, args, condition, canceled } of array) {

			if (canceled)
				continue

			if (condition && !condition(array[i]))
				continue

			callback.apply(thisArg, args)

		}

		array.length = 0
		this.count = 0

		this.locked = false

		update(this)

	}

	clear() {

		for (let object of this.array)
			destroyObject(object)

		for (let object of this.addArray)
			destroyObject(object)

		this.array.length = 0
		this.addArray.length = 0
		this.count = 0

	}

}
