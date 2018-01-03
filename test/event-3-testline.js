
// TEST - Basic

let object = {}

eventjs.on(object, 'foo', event => log(event.type))
eventjs.dispatchEvent(object, 'foo')

// log.break

log.assert(`must be written "foo" above`, () => log.last === 'foo')







// TEST - Priority


let object = {}

eventjs.on(object, 'foo', event => log('listener 1:', event.type))
eventjs.on(object, 'foo', event => log('listener 2:', event.type))
eventjs.dispatchEvent(object, 'foo')

// log.break

log.assert(`2 listeners should have log ("listener 1: foo", "listener 2: foo")`, () => log.getLog(-2) === 'listener 1: foo' && log.getLog(-1) === 'listener 2: foo')



// log.break

eventjs.on(object, 'foo', event => log('listener 3:', event.type, '{ priority: 10 }'), { priority: 10 })
eventjs.dispatchEvent(object, 'foo')

// log.break

log.assert(`listener 3 should be first to log`, () => /listener 3/.test(log.getLog(-3)))



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

log.assert(`order should be '4,6,3,5,1,2'`, () => log.getLogs(-6).map(v => v.slice(9, 10)).join() === '4,6,3,5,1,2')

