let waitingNodes = new Map()
let waitingCount = 0

const wait = node => {

	let id = 'waiting' + waitingCount++

	waitingNodes.set(id, node)

	return `<span class='waiting-node'>${id}</span>`

}

const processChild = child => {

	if (child instanceof Node)
		return wait(child)

	if (typeof child === 'object' && 'string' in child)
		return child.string

	return child

}

const attrToString = (attr) => {

    let entries = Object.entries(attr)

    if (entries.length === 0)
        return ''

    return ' ' + entries.map(([key, value]) => `${key}="${value}"`).join(' ')

}

export default new Proxy({

	div: document.createElement('div'),

	dom(string) {

		this.div.innerHTML = string

		for (let span of this.div.firstChild.querySelectorAll('span.waiting-node')) {

			let original = waitingNodes.get(span.innerHTML)

			span.parentNode.replaceChild(original, span)

		}

		return this.div.firstChild

	},

}, {

	get(target, name) {

		return new Proxy(function (name, classes, styles, attr, ...content) {

			classes = classes.length ? ` class="${classes.join(' ')}"` : ''
			styles = Object.entries(Object.assign({}, ...styles)).map(([key, value]) => `${key}: ${value};`).join('')
			styles = styles.length ? ` style="${styles}"` : ''

			let string = `<${name}${classes}${styles}${attrToString(attr)}>${content.map(processChild).join('')}</${name}>`

			return {

				string,
				get element() { return target.dom(string) },

			}

		}, {

			name,
			classes: [],
			styles: [],
            attr: {},

			get(target, key, proxy) {

				if (key === 'class')
					return (...args) => {
						this.classes.push(...args)
						return proxy
					}

				if (key === 'style')
					return (...args) => {
						this.styles.push(...args)
						return proxy
					}

                if (key === 'attr') {
                    return (...props) => {
                        for (let prop of props)
                            Object.assign(this.attr, prop)
                        return proxy
                    }
                }

				this.name = key

				return proxy

			},

			apply(target, thisArg, args) {

				return target(this.name, this.classes, this.styles, this.attr, ...args)

			},

		})

	},

})

/*

let array = [...'abcdef']

document.body.append(

    html.header(`hello i'm header`).element,

    html.div.class('alphabet')(

        ...array.map((letter, index) => html.div.attr({ index: index })(letter))

    ).element,

)

*/
