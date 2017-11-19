import * as eventjs from './event.js'

const clamp = x => x < 0 ? 0 : x > 1 ? 1 : x

const relations = {

	'&&': (a, b) => a && b,
	'||': (a, b) => a || b,
	'+': (a, b) => a + b,
	'-': (a, b) => a - b,
	'*': (a, b) => a * b,
	'/': (a, b) => a / b,
	'**': (a, b) => a ** b,
	'clamp(*)': (a, b) => clamp(a * b),

}

function computeChain(chain) {

	let oldValue = chain.value

	let value = chain.computeValue()

	let changed = false

	if (typeof oldValue === 'number' && typeof value === 'number') {
		
		changed = Math.abs(value - oldValue) > Chain.epsilon

	} else {

		changed = value !== oldValue

	}

	if (changed) {

		chain.value = value
		chain.dispatchEvent('change', { value })

	}

}

function createLink(chain, key, { value = 1, relation = null, authority = 0 }) {

	let _value = value
	let _authority = authority
	let _relation = relation

	function set({ value, authority, relation }) {

		let changed = false

		if (value !== undefined && value !== _value) {

			changed = true
			_value = value

		}

		if (authority !== undefined && authority !== _authority) {

			changed = true
			_authority = authority

		}

		if (relation !== undefined && relation !== _relation) {

			changed = true
			_relation = relation

		}

		if (changed)
			computeChain(chain)

	}

	let link = {

		chain,

		key,

		set,

		get value() { return _value },
		set value(value) { set({ value: value }) },

		get authority() { return _authority },
		set authority(value) { set({ authority: value }) },

		get relation() { return _relation },
		set relation(value) { set({ relation: value }) },

		toString() {

			return `Link { k: ${this.key}, v: ${this.value}, a: ${this.authority}, r: ${this.relation} }`

		},

	}

	chain.links.push(link)

	computeChain(chain)

}

function searchLink(chain, key) {

	for (let link of chain.links)
		if (link.key === key)
			return link

	return null

}

export class Chain extends eventjs.EventDispatcher {

	static get epsilon() { return 1e-12 }

	constructor(relation = '*', initialValue = 1) {

		super()

		Object.defineProperties(this, {

			relation: {

				get() { return relation },

				set(value) { 

					relation = value
					computeChain(this)

				},

			},

			initialValue: {

				get() { return initialValue },

				set(value) { 

					initialValue = value
					computeChain(this)

				},

			},

		})

		this.links = []

		computeChain(this)

	}

	computeValue() {

		let value = this.initialValue

		this.links.sort((A, B) => A.authority - B.authority)

		for (let link of this.links)
			value = relations[link.relation || this.relation](value, link.value)

		return value

	}

	getLink(key, { createIfNull = true, value, relation, authority } = {}) {

		let link = searchLink(this, key)

		if (!link && createIfNull) {

			link = createLink(this, key, { value, relation, authority })

		} else if (link) {

			link.set({ value, relation, authority })

		}

		return link

	}

	link(key, options) {

		this.getLink(key, options)

		return this

	}

	getEvalString() {

		let str = this.initialValue.toString()

		for (let link of this.links)
			str = `(${str} ${link.relation || this.relation} ${link.value})`

		return str

	}

	toString() {

		return `Chain(${this.links.length}) { iv: ${this.initialValue}, r: ${this.relation}, v: ${this.value} }`

	}

}










