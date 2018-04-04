import { Stack } from '../src/stack.js'

class A {
    foo() { console.log(this && '{A}' || 'null', 'foo!') }
    bar() { console.log(this && '{A}' || 'null', 'bar!') }
    autoAdd(stack) {
        console.log('autoAdd')
        stack.add(this.autoAdd, { thisArg: this, args: [stack] })
    }
    autoRemove(stack) {
        console.log('autoRemove')
        stack.remove(this)
    }
}

let a1 = new A()
let a2 = new A()

let stack = new Stack()
stack.add(a1.foo)
stack.add(a2.foo)

console.log('stack.count', stack.count)
stack.execute()

stack.remove(a1.foo) // will also remove a2.foo (since a1.foo === a2.foo (foo belongs to A.prototype and not to a1 or a2))
console.log('a1.foo === a2.foo', a1.foo === a2.foo)

console.log('stack.count', stack.count)

stack.add(a1.foo, { thisArg: a1 })
stack.add(a2.foo, { thisArg: a2 })

console.log('stack.count', stack.count)
stack.execute()

stack.remove(a1.foo, { thisArg: a1 })

console.log('stack.count', stack.count)
stack.execute()

console.log('')

stack.add(a2.bar, { thisArg: a2 })
stack.execute()

stack.remove(null, { thisArg: a2 })
console.log('stack.count', stack.count)


console.log(`\nTEST addAsObject, removeAsObject`)
stack.add(a1, 'foo')
stack.add(a1, 'foo')
stack.add(a1, 'bar')
console.log('stack.count', stack.count)
stack.execute()
stack.remove(a1, 'foo')
console.log('stack.count', stack.count)
stack.remove(a1)
console.log('stack.count', stack.count)





console.log(`\nTEST locked`)
// stack.add(a1.autoAdd, { thisArg: a1, args: [stack] })
stack.add(a1, 'autoAdd', stack)
console.log('stack.count', stack.count)
stack.execute()
console.log('stack.count', stack.count)
stack.execute()
console.log('stack.count', stack.count)

stack.add(a1, 'autoRemove', stack)
stack.execute()
console.log('stack.count', stack.count)
stack.execute()
console.log('stack.count', stack.count)






console.log(`\nTEST clear`)
stack.clear()
stack.execute()
console.log('stack.count', stack.count)
