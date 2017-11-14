class Link {

	constructor(key, value) {

		this.key = key
		this.value = value

	}

	toString() {

		return `Link { value: ${this.value} }`

	}

}

const clamp = x => x < 0 ? 0 : x > 1 ? 1 : x

const relations = {

	'*': (a, b) => a * b,
	'+': (a, b) => a + b,
	'&&': (a, b) => a && b,
	'||': (a, b) => a || b,
	'clamp(*)': (a, b) => clamp(a * b),

}

export class Chain {

	constructor(relation = '*', initialValue = 1) {

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
			value = relations[this.relation](value, link.value)

		return value

	}

	get value() { return this.getValue() }

	searchLink(key) {

		for (let link of this.links)
			if (link.key === key)
				return link

		return null

	}

	createLink(key, value) {

		let link = this.searchLink(key)

		if (link)
			throw `a Link already exist for ${String(key)}`

		link = new Link(key, value)

		this.links.push(link)

		this.count++

		return link

	}

	getLink(key, { createIfNull = true, value = null } = {}) {

		let link = this.searchLink(key)

		if (!link && createIfNull)
			link = this.createLink(key)

		if (link && value)
			link.value = value

		return link

	}

	link(key, options) {

		this.getLink(key, options)

		return this

	}

	toString() {

		return `Chain { relation: ${this.relation}, count: ${this.count}, initialValue: ${this.initialValue}, value: ${this.value} }`

	}

}