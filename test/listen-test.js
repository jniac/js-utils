
import Listen from '../src/Listen.js'

console.logBreak = () => console.log('- '.repeat(1 + 42/2))
console.logTitle = (...titles) => {

    let n = 41

    titles = titles.map((title) => {

        let n1 = Math.floor((n - title.length) / 2)
        let n2 = n - title.length - n1

        return `-${' '.repeat(n1) + title + ' '.repeat(n2)}-`

    }).join('\n')

    let str =
        `-${' '.repeat(n)}-` + '\n' +
        titles + '\n' +
        `-${' '.repeat(n)}-`

    console.log(str)

}



Listen.add('FOO', 'BAR', event => console.log(event))
Listen.call('FOO', 'BAR', 'hello')

console.logBreak()

// multiple listener
let arr = ['BAZ','QUX']
Listen.add('FOO', 'BAZ,QUX', event => console.log('string', Listen.event.type, event))
Listen.add('FOO', arr, event => console.log('array', Listen.event.type, event))
Listen.add('FOO', '*', () => console.log(`it's a trap (*)`))
Listen.add('FOO', /baz|qux/i, () => console.log(`re has you (/baz|qux/i)`))

Listen.call('FOO', 'BAZ', 'hello baz')

console.logBreak()

// multiple call
console.logTitle('multiple call', `'BAZ,QUX'`)
Listen.call('FOO', 'BAZ,QUX', 'hello both')

console.logBreak()

Listen.remove('FOO', 'BAZ,QUX')
Listen.call('FOO', 'BAZ,QUX', 'no more string [BAZ,QUX] listener here')

console.logBreak()

Listen.call('FOO', 'BAR', 'hello')

console.logBreak()

arr.push('BAR')
Listen.call('FOO', 'BAR', 'hello')

console.logBreak()

Listen.remove('FOO', arr)
Listen.call('FOO', 'BAR', 'hello')

console.logBreak()

Listen.remove('FOO', '*')
Listen.call('FOO', 'BAZ,QUX', 'no more listener here')
Listen.call('FOO', 'BAR', 'no more listener here')




console.logBreak()
console.logTitle('cancel(), priority & key')

Listen.add(window, 'an-event', (...args) => console.log('listener 1', Listen.event.type, ...args))
Listen.add(window, 'an-event', (...args) => console.log('listener 2', Listen.event.type, ...args))
Listen.add(window, 'an-event', (...args) => console.log('listener 3', Listen.event.type, ...args))
Listen.call(window, 'an-event', 'with', 'some', 'args')

console.logBreak()

let A_UNIQUE_KEY = Symbol('A_UNIQUE_KEY')

Listen.add(window, 'an-event', (...args) => {

	console.log('listener ZERO!!!', Listen.event.type, ...args)
	Listen.event.cancel()

}, { priority: 1, key: A_UNIQUE_KEY })

Listen.call(window, 'an-event', 'that will', 'be canceled', 'by a first listener!!!!')

console.logBreak()

Listen.remove(window, 'an-event', null, { key: A_UNIQUE_KEY })
Listen.call(window, 'an-event', 'with', 'some', 'args')




console.logBreak()
console.logTitle('class/instances case', '[this, methodName]')

let FooCount = 0
class Foo {

	constructor() {

		this.uid = FooCount++
		Listen.add(Foo, 'bar', [this, 'print'])

	}

	unsubscribe() {

		Listen.remove(Foo, 'bar', [this, 'print'])

	}

	print() {

		console.log(`Foo#${this.uid}{} react to "${Listen.event.type}" event`)

	}

}

let fooz = [new Foo(), new Foo(), new Foo()]

Listen.call(Foo, 'bar')

console.logBreak()

Listen.remove(Foo, 'bar', fooz[1].print)
// Listen.remove(Foo, 'bar', Foo.prototype.print)
Listen.call(Foo, 'bar')
console.log(`...
(all callbacks have been removed
because the callback is a prototype member
(shared between all instances))
...`)

console.logBreak()

fooz = [new Foo(), new Foo(), new Foo(), new Foo()]

console.log(`Foo, 'bar'`)
Listen.call(Foo, 'bar')

console.logBreak()

Listen.remove(Foo, 'bar', [fooz[1], 'print'])

console.log(`Foo, 'bar'`)
Listen.call(Foo, 'bar')

console.logBreak()

fooz[0].unsubscribe()

console.log(`Foo, 'bar'`)
Listen.call(Foo, 'bar')

console.logBreak()

Listen.remove(Foo, 'bar', Listen.ALL)

console.log(`Foo, 'bar'`)
Listen.call(Foo, 'bar')

console.logBreak()



console.logTitle('add() or remove()', 'from inside a call', 'does NOT corrupt', 'the current call')

Listen.add(null, 'START', (message) => {

    console.log(`[${message}] fill start`)

    for (let i = 0; i < 4; i++)
        Listen.add(null, 'START', (message) => console.log(`[${message}] starter #${i}`))

    Listen.add(null, 'START', (message) => console.log(`[${message}] starter ZERO!`), { priority:1  })

    Listen.add(null, 'START', (message) => {

        console.log(`[${message}] clear start (the next call will not produce anything)`)

        Listen.remove(null, 'START', Listen.ALL)

    })

    for (let i = 4; i < 8; i++)
        Listen.add(null, 'START', (message) => console.log(`[${message}] starter #${i}`))

    return Listen.KILL

})

console.log('first:')
Listen.call(null, 'START', 'first')
console.logBreak()

console.log('second:')
Listen.call(null, 'START', 'second')
console.logBreak()

console.log('muted:')
Listen.call(null, 'START', 'muted')
console.logBreak()

console.logTitle('Listen.reset()')
Listen.add(window, '*', () => console.log(`${Listen.event.type}`))
Listen.call(window, 'test')
console.log('before reset:', Listen.debug(window))
Listen.reset()
console.log('after reset:', Listen.debug(window))


//
console.logBreak()
console.logTitle('[thisArg, methodName]')
let obj = {
    name: 'foo',
    hello() { console.log(`hello, my name is ${this.name}`) },
    random() { console.log(Math.random()) },
}

// double add() should be ignored
Listen.add('THIS', 'ARG', [obj, 'hello'])
Listen.add('THIS', 'ARG', [obj, 'hello'])
// but not another method
Listen.add('THIS', 'ARG', [obj, 'random'])
Listen.add('THIS', 'ARG', [obj, 'random'])

console.log('    * foo() called once only?')
Listen.call('THIS', 'ARG')
console.log('    * foo() called once only!')

// '*' should match every callback with [thisArg] === [obj]
Listen.remove('THIS', 'ARG', [obj, '*'])

console.log('    * muted?')

Listen.call('THIS', 'ARG')

console.log('    * muted!')


//
console.logBreak()
console.logTitle('Listen.log()')
Listen.log('APP')
Listen.log('APP', /hello/, { priority:Infinity }) // options are still available (priority etc.)
Listen.call('APP', 'hello')


//
console.logBreak()
console.logTitle('async Listen.waitFor()')

async function testWaitFor() {

    let [event, ...args] = await Listen.waitFor('WAIT', '*', null, { args:['(async!)'], priority:Infinity })

    console.log('[await] callback', `"${event.type}"`, ...args)

}

Listen.add('WAIT', '*', (...args) => console.log('[classic] callback', `"${Listen.event.type}"`, ...args))

testWaitFor()

Listen.call('WAIT', 'now', 'a super cool arg')

console.log('be careful, promises are NOT immediate: \nresolve() always wait the next tick to be called')

testWaitFor()
setTimeout(() => Listen.call('WAIT', 'one_tick_later', 'a super cool arg'), 100)


export { Listen }
