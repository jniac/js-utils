import * as eventjs from './event.js'

class Link {

	constructor(chain, key, { value, relation }) {

		this.chain = chain
		this.key = key

		this.__value = value
		this.__relation = relation

	}

	set({ value, relation }) {

		this.setValue(value, false)
		this.setRelation(relation, false)

		if (this.changed) {

			this.changed = false
			this.chain.dispatchEvent('change') 

		}

		return this

	}

	setValue(value, dispatchEvent = true) {

		if (value === undefined || this.__value === value)
			return

		this.__oldValue = this.__value
		this.__value = value

		dispatchEvent ? this.chain.dispatchEvent('change') : this.changed = true

		return this

	}

	get value() { return this.__value }
	set value(value) { this.setValue(value) }

	setRelation(value, dispatchEvent = true) {

		if (value === undefined || this.__relation === value)
			return

		this.__relation = value

		dispatchEvent ? this.chain.dispatchEvent('change') : this.changed = true

		return this

	}

	get relation() { return this.__relation }
	set relation(value) { this.setRelation(value) }

	toString() {

		return `Link{ value: ${this.value} ${this.relation ? `relation: ${this.relation} ` : ''}}`

	}

}

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

export class Chain extends eventjs.EventDispatcher {

	constructor(relation = '*', initialValue = 1) {

		super()

		Object.defineProperties(this, {

			links: { value: [] },

		})

		this.relation = relation
		this.initialValue = initialValue

		this.count = 0

	}

	getValue() {

		let value = this.initialValue

		for (let link of this.links)
			value = relations[link.relation || this.relation](value, link.value)

		return value

	}

	get value() { return this.getValue() }

	searchLink(key) {

		for (let link of this.links)
			if (link.key === key)
				return link

		return null

	}

	createLink(key, linkSettings) {

		let link = this.searchLink(key)

		if (link)
			throw `a Link already exist for ${String(key)}`

		link = new Link(this, key, linkSettings)

		this.links.push(link)

		this.count++

		this.dispatchEvent('change')

		return link

	}

	getLink(key, { createIfNull = true, value, relation } = {}) {

		let link = this.searchLink(key)

		if (!link && createIfNull) {

			link = this.createLink(key, { value, relation })
			
		} else if (link) {

			link.set({ value, relation })

		}

		return link

	}

	link(key, options) {

		this.getLink(key, options)

		return this

	}

	toString() {

		return `Chain{ relation: ${this.relation}, count: ${this.count}, initialValue: ${this.initialValue}, value: ${this.value} }`

	}

}