/**
 * EnumKey can be compared via 'is':
 *
 * let e = new Enum('FOO', 'BAR')
 * let key = e.FOO
 * key.is.FOO // true
 * key.is.BAR // false
 *
 * EnumKey can be multiple:
 * let e = new Enum('VERTICAL|V', 'HORIZONTAL|H')
 * e.VERTICAL === e.V // true
 * e.VERTICAL.is.V // true
 *
 */

let EnumKeyUID = 0
class EnumKey {

	constructor(enumInstance, names, index/*index, keys*/) {

		names = names.split(/\s*\|\s*|\s+/)

        let [name, ...altNames] = names

		Object.assign(this, {

			uid: EnumKeyUID++,
			name,
			names,
			altNames,
			index,
            enum: enumInstance,

		})

	}

    test(key, flags = '') {

        if (key === this)
            return true

        if (key instanceof RegExp)
            return key.test(this.name)

		if (flags.includes('i'))
			return this.names.some(name => name.toLowerCase() === key.toLowerCase())


        return this.names.some(name => name === key)

    }

	*keys() {

		for (let name of this.names)
			yield name

	}

	toString() { return `EnumKey(${this.names.join('|')})` }

	valueOf() { return this.uid }

}





export class Enum {

	constructor(...keys) {

		let count = 0

		for (let key of keys) {

			let enumKey = new EnumKey(this, key, count++)

			Object.defineProperty(this, enumKey.name, {

				value: enumKey,
				enumerable: true,

			})

			for (let key of enumKey.altNames)
				Object.defineProperty(this, key, {

					value: enumKey,
					enumerable: false,

				})

		}

		Object.defineProperty(this, 'count', { value: count })

		keys = [...this.keys()]

		for (let enumKey of Object.values(this)) {

			let keyIs = {}

			for (let key of keys)
				Object.defineProperty(keyIs, key, {

					value: this[key] === enumKey,
					enumerable: true,

				})

			enumKey.is = Object.freeze(keyIs)

			Object.freeze(enumKey)

		}

		Object.freeze(this)

	}

	has(key) { return this[key] === key }

	resolve(key, flags = '') {

		if (key instanceof EnumKey)
			return key

		for (let enumKey of Object.values(this))
			if (enumKey.test(key, flags))
				return enumKey

		return null

	}

	*[Symbol.iterator]() {

		for (let key of Object.keys(this))
			yield this[key]

	}

    *keys() {

		for (let enumKey of Object.values(this))
			for (let key of enumKey.keys())
				yield key

    }

	toString() { return [...this].join(', ') }

}

export default Enum
