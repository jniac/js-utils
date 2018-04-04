
// TEST - Basic

let object = {}

eventjs.on(object, 'foo', event => log(event.type))
eventjs.dispatchEvent(object, 'foo')

// log.break

log.assert(`must be written "foo" above`, log.last === 'foo')







// TEST - Usage

let count = 0

let logEvent = event => log(count++, event.type)

let foo = { }
let bar = new eventjs.EventDispatcher()
let quz = { }
eventjs.implementEventDispatcher(quz)

eventjs.on(foo, 'foo!', logEvent)
bar.on('bar!!', logEvent)
quz.on('quz!!!', logEvent)

eventjs.dispatchEvent(foo, 'foo!')
bar.dispatchEvent('bar!!')
quz.dispatchEvent('quz!!!')

// log.break

log.assert('foo, bar & quz have logged', log.getLog(-3) === '0 foo!' && log.getLog(-2) === '1 bar!!' && log.getLog(-1) === '2 quz!!!')

// log.break

log.info(`event & listener dissociation
remove ONE listener:
off(eventType, eventListener)`)

// log.break

eventjs.off(foo, 'foo!', logEvent)
bar.off('bar!!', logEvent)
quz.off('quz!!!', logEvent)

eventjs.dispatchEvent(foo, 'foo!')
bar.dispatchEvent('bar!!')
quz.dispatchEvent('quz!!!')

log.assert(`nothing has logged`, log.getLog(-3) === '0 foo!' && log.getLog(-2) === '1 bar!!' && log.getLog(-1) === '2 quz!!!')

// log.break

eventjs.on(foo, 'foo!', logEvent)
bar.on('bar!!', logEvent)
quz.on('quz!!!', logEvent)

eventjs.dispatchEvent(foo, 'foo!')
bar.dispatchEvent('bar!!')
quz.dispatchEvent('quz!!!')

// log.break

log.assert('foo, bar & quz have come back', log.getLog(-3) === '3 foo!' && log.getLog(-2) === '4 bar!!' && log.getLog(-1) === '5 quz!!!')

// log.break

log.info(`event & listener dissociation
remove ALL listener:
off(eventType, eventListener)`)

// log.break
eventjs.off(foo, 'foo!')
bar.off('bar!!')
quz.off('quz!!!')

log.assert('nothing has logged', log.getLog(-3) === '3 foo!' && log.getLog(-2) === '4 bar!!' && log.getLog(-1) === '5 quz!!!')









// TEST - Priority

let object = {}

eventjs.on(object, 'foo', event => log('listener 1:', event.type))
eventjs.on(object, 'foo', event => log('listener 2:', event.type))
eventjs.dispatchEvent(object, 'foo')

// log.break

log.assert(`2 listeners should have log ("listener 1: foo", "listener 2: foo")`, log.getLog(-2) === 'listener 1: foo' && log.getLog(-1) === 'listener 2: foo')



// log.break

eventjs.on(object, 'foo', event => log('listener 3:', event.type, '{ priority: 10 }'), { priority: 10 })
eventjs.dispatchEvent(object, 'foo')

// log.break

log.assert(`listener 3 should be first to log`, /listener 3/.test(log.getLog(-3)))



// log.break

eventjs.on(object, 'foo',
	event => log('listener 4:', event.type, '{ priority: 100 }'),
	{ priority: 100 })

eventjs.on(object, 'foo',
	event => log('listener 5:', event.type, '{ priority: 10 }'),
	{ priority: 10 })

eventjs.on(object, 'foo',
	event => log('listener 6:', event.type, '{ priority: 10, insertFirst: true }'),
	{ priority: 10, insertFirst: true })

eventjs.dispatchEvent(object, 'foo')

// log.break

log.assert(`order should be '4,6,3,5,1,2'`, log.getLogs(-6).map(v => v.slice(9, 10)).join() === '4,6,3,5,1,2')







// TEST - thisArg, args

let foo = new eventjs.EventDispatcher()

class Show {

	constructor() {

		foo.on('BAR', this.onBar, { thisArg: this, args: ['me the way to the next', 'whisky'] })

	}

	onBar(event, lyrics, lyrics2) {

		log(this.constructor.name, lyrics, lyrics2, event.type)

	}

}

new Show()

foo.dispatchEvent('BAR')

log.assert('should be logged: "Show me the way to the next whisky BAR"', log.last === 'Show me the way to the next whisky BAR')






// TEST - thisArg, off, 2nd way of adding listner

;(() => {

	let ed = new eventjs.EventDispatcher()

	let uid = 0

	class Foo {

		constructor() {

			this.uid = uid++

			ed.on('foo', this.onFoo, { thisArg: this })

		}

		onFoo(event) {

			log('Foo#' + this.uid, event.type)

		}

	}

	let agent1 = new Foo()
	let agent2 = new Foo()

	ed.dispatchEvent('foo')

	ed.off('foo', agent1.onFoo, { thisArg: agent1 })

	ed.dispatchEvent('foo')

	log.assert('only Foo#0 should be off', log.getLogs(-3).join(' ') === 'Foo#0 foo Foo#1 foo Foo#1 foo')

})()






// TEST - 2nd way of adding listener

log(`myObject.on(event, myInstance.callback, { thisArg: myInstance }) is too long to write
let's introduce: .on(event, object, key)!
myObject.on(event, myInstance, 'callback') // shorter & easier
`)

// log.break

;(() => {

	let ed = new eventjs.EventDispatcher()

	let uid = 0

	class Bar {

		constructor() {

			this.uid = uid++

			ed.on('bar', this, 'onBar')

		}

		onBar(event) {

			log('Bar#' + this.uid, event.type)

		}

	}

	let agent1 = new Bar()
	let agent2 = new Bar()

	ed.dispatchEvent('bar')

	ed.off('bar', agent1, 'onBar')

	ed.dispatchEvent('bar')

	log.assert('Bar#0 should be off', log.getLogs(-3).join(' ') === 'Bar#0 bar Bar#1 bar Bar#1 bar')

})()
