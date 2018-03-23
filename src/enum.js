/**
 * key can be compared via 'is':
 *
 * let e = new Enum('FOO', 'BAR')
 * let key = e.FOO
 * key.is.FOO // true
 * key.is.BAR // false
 *
 */
class EnumKey {

	constructor(enumInstance, names, index/*index, keys*/) {

		names = names.split(/\s*\|\s*|\s+/)

        let [name, ...altNames] = names

		Object.assign(this, {

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

	toString() { return this.name }

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
