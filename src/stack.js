
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

function add(stack, callback, thisArg = null, args = null) {

	if (!callback)
		return

	if (stack.locked) {

		stack.addArray.push({ callback, thisArg, args })

	} else {

		stack.array.push({ callback, thisArg, args })
		stack.count++

	}

}

function addAsObject(stack, object, key, ...args) {

	add(stack, object[key], object, args)

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

function removeAsObject(stack, object, key) {

	remove(stack, object[key], object)

}

export class Stack {

	constructor() {

		this.array = []
		this.addArray = []
		this.count = 0
		this.canceledCount = 0

	}

	add(callback, { thisArg = null, args = null  } = {}) {

		if (callback && (typeof callback === 'object')) {

			addAsObject(this, ...arguments)
			return this

		}

		add(this, callback, thisArg, args)

		return this

	}

	remove(callback, { thisArg = null  } = {}) {

		if (callback && (typeof callback === 'object')) {

			removeAsObject(this, ...arguments)
			return this

		}

		remove(this, callback, thisArg)

		return this

	}

	execute() {

		let { array } = this

		this.locked = true

		for (let i = 0, n = array.length; i < n; i++) {

			let { callback, thisArg, args, canceled } = array[i]

			if (canceled)
				continue

			if (callback.apply(thisArg, args) === false) {

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

		for (let { callback, thisArg, args, canceled } of array)
			if (!canceled)
				callback.apply(thisArg, args)

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
