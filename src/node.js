
let nodeUID = 0

class Node {

	constructor(props) {

		Object.defineProperty(this, 'uid', { enumerable: true, value: nodeUID++ })

		this.root = this

		Object.assign(this, props)

	}

	appendChild(child) {

		if (child.parent)
			removeChild(child.parent, child)

		child.parent = this
		child.root = this.root

		if (this.lastChild) {

			this.lastChild.next = child
			child.previous = this.lastChild
			this.lastChild = child

		} else {

			this.firstChild = 
			this.lastChild = child

		}

	}

	removeChild(child) {

		if (this.lastChild === child)
			this.lastChild = child.previous

		if (this.firstChild === child)
			this.firstChild = child.next

		let { previous, next } = child

		if (previous)
			previous.next = next

		if (next)
			next.previous = previous

		child.parent = null
		child.root = null
		child.previous = null
		child.next = null

	}

	*[Symbol.iterator]() {

		let child = this.firstChild

		while(child) {

			yield child

			child = child.next

		}

	}

}

n1 = new Node({ name: 'n1' })

n1.appendChild(n2 = new Node({ name: 'n2' }))
n1.appendChild(n3 = new Node({ name: 'n3' }))
n1.appendChild(n4 = new Node({ name: 'n4' }))

n1.removeChild(n3)

;[...n1]

