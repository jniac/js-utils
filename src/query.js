
// utils

export function copy(object, { recursive = false, exclude = null } = {}) {

	if (typeof object !== 'object')
		return object

	// let result = new object.constructor()
	let result = {}

	if (exclude && typeof exclude === 'string')
		exclude = exclude.split(/,\s|,|\s/)

	for (let k in object) {

		if (exclude.includes(k))
			continue

		let value = object[k]

		if (recursive && typeof value === 'object')
			value = copy(value, { recursive, exclude })

		result[k] = value

	}

	return result

}

export function propsToString(props) {

	let entries = Object.entries(props)

	if (!entries.length)
		return '{}'

	return `{ ${entries.map(([k, v]) => {

		if (v === true)
			return k

		return k + ': ' + v

	}).join(', ')} }`

}

/*

query(object, 'page enabled')
query(object, 'page !enabled')
query(object, 'page enabled > section')
query(object, 'page enabled pagination.number>0 > section')
query(object, 'page enabled pagination[number>0] > section')
query(object, 'section name=bob')

*/

const SelectorOp = {

	'=': 	(lhs, rhs) => String(lhs) === String(rhs),
	'!=': 	(lhs, rhs) => String(lhs) !== String(rhs),
	'>': 	(lhs, rhs) => parseFloat(lhs) > parseFloat(rhs),
	'>=': 	(lhs, rhs) => parseFloat(lhs) >= parseFloat(rhs),
	'<': 	(lhs, rhs) => parseFloat(lhs) < parseFloat(rhs),
	'<=': 	(lhs, rhs) => parseFloat(lhs) <= parseFloat(rhs),

}

function makeTest(str) {

	let [, not, key, op, rhs] = str.match(/(!)?([\w-]+|\*)(=|!=|>|>=|<|<=)?([\w-]+)?/)

	if (key === '*')
		return object => true

	return not
	 	? object => object && object.hasOwnProperty(key) && !object[key]
		: op
			? object => object && SelectorOp[op](object[key], rhs)
			: object => object && object.hasOwnProperty(key) && !!object[key]

}

function getChildren(object, childrenDelegate, includeSelf) {

	let array = includeSelf ? [object] : []

	let children = childrenDelegate(object)

	if (children)
		for (let child of children)
			array.push(...getChildren(child, childrenDelegate, true))

	return array

}

/**
 * returns children objects matching selector
 * selector rules:
 *
 *    • Match only the first result (the result will not be necessarily iterable)
 *    'first:{selector}' or 'f:{selector}'
 *
 *    • Match multiple:
 *    'type=page !isRoot width>100'
 *
 *    • Match children
 *    '[str] > [str]'
 *
 */
export function query(object, selector, { firstOnly = false, propsDelegate = 'props', childrenDelegate = 'children' } = {}) {

	if (typeof propsDelegate === 'string') {

		let key = propsDelegate
		propsDelegate = object => object[key]

	}

	if (typeof childrenDelegate === 'string') {

		let key = childrenDelegate
		childrenDelegate = object => object[key]

	}

	if (/^f:|^first:/.test(selector)) {

		firstOnly = true
		selector = selector.replace(/^f:|^first:/, '')

	}

	let includeSelf = true

	if (/^\s*>\s+/.test(selector)) {

		selector = selector.replace(/^\s*>\s+/, '')
		includeSelf = false

	}

	let stages = selector
		.split(/\s+>\s+/)
		.map(str => str
			.split(/\s+/)
			.map(str => makeTest(str)))

	let array, candidates = getChildren(object, childrenDelegate, includeSelf)

	for (let [index, stage] of stages.entries()) {

		array = []

		for (let candidate of candidates) {

			let props = propsDelegate(candidate)

			if (stage.every(test => test(props)))
				array.push(candidate)

		}

		candidates = [].concat(...array.map(candidate => childrenDelegate(candidate) || []))

	}

	return firstOnly ? array[0] || null : array

}

export default query
