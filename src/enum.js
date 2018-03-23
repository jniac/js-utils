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

	constructor(enumInstance, index, keys) {

        let name = keys[index]

		Object.assign(this, {

			name,
			index,
            enum: enumInstance,
			is: keys.reduce((r, v, i) => Object.defineProperty(r, v, {

				value: i === index,
				enumerable: true,

			}), {}),

		})

		Object.freeze(this)

	}

    test(key, { ignoreCase = false } = {}) {

        if (key === this)
            return true

        if (key instanceof RegExp)
            return key.test(this.name)

        let re = new RegExp(`^${this.name}$`, ignoreCase ? 'i' : '')

        return re.test(key)

    }

	toString() { return this.name }

}

export class Enum {

	constructor(...keys) {

		for (let [index, key] of keys.entries()) {

			Object.defineProperty(this, key, {

				value: new EnumKey(this, index, keys),
				enumerable: true,

			})

		}

		Object.freeze(this)

	}

	has(key) { return this[key] === key }

	*[Symbol.iterator]() {

		for (let key of Object.keys(this))
			yield this[key]

	}

    *keys() {

		for (let key of Object.keys(this))
			yield this[key].name

    }

	toString() { return [...this].join(', ') }

}

export default Enum
