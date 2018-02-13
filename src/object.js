
function dumpArray(object, arrayName, filter) {

	let tmp = object[arrayName]
	object[arrayName] = []
	object[arrayName] = tmp.filter(value => filter(value)).concat(object[arrayName])

}





class BaseProperty {

	constructor(value) {

		this._value = value
		this.valueOld = undefined

		this.changeArray = []

	}

	setValue(value) {

		this.valueOld = this.value
		this._value = value

	}

	get value() { return this._value }
	set value(value) { this.setValue(value) }

	link(name, object) {

		Object.defineProperty(object, name, {

			get: () => this._value,
			set: value => this.setValue(value),

		})

		return this

	}

	onChange(callback) {

		this.changeArray.push(callback)

		return this

	}

}





export class BooleanProperty extends BaseProperty {

	constructor(value) {

		super(value)

	}

	setValue(value) {

		value = !!value

		if (this._value === value)
			return this

		this._value = value

		dumpArray(this, 'changeArray', callback => callback(value, this.valueOld) !== false)
		
		return this

	}

}





export class NumberProperty extends BaseProperty {

	constructor(value, { min = 0, max = 1, clamp = true } = {}) {

		super(value)

		if (clamp) {

			this.min = min
			this.max = max

		} else {

			this.min = -Infinity
			this.max = Infinity

		}

		this.throughArray = []

	}

	setValue(value) {

		value = value < this.min ? this.min : value > this.max ? this.max : value

		if (this._value === value)
			return this

		super.setValue(value)

		this.change = this._value - this.valueOld

		dumpArray(this, 'changeArray', callback => callback(value, this.valueOld) !== false)
		dumpArray(this, 'throughArray', stop => {

			let sign = this.through(stop.threshold)

			if (sign === 0)
				return true

			return stop.callback(sign, stop.threshold, value) !== false

		})
		
		return this

	}

	through(threshold) {

		return this.valueOld < threshold && this._value >= threshold ? 1 : 
			this.valueOld > threshold && this._value <= threshold ? -1 : 0

	}

	onThrough(threshold, callback) {

		this.throughArray.push({ threshold, callback })

		return this

	}

}
