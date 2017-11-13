# js-utils
Javascript utilies for common needs (events, math, tree etc.)

# event.js
EventDispatcher that can be herited or implemented:
	
	class Foo extends eventjs.EventDispatcher { ... }
	 
	eventjs.implementEventDispatcher(Foo.prototype)

	let foo = {}
	eventjs.implementEventDispatcher(foo)
	 
	let foo = eventjs.implementEventDispatcher({
		member1: value1,
		...
	})

Shorthands (on/once/off, optional when choosing implementation instead inheritance) 

	foo.on('bar', listener)
	foo.once('baz', listener)
	foo.off('bar', listener)    // remove one listener
	foo.off('bar')              // remove all listeners that listen 'bar'

Priority

	foo.on('bar', listener)
	foo.on('bar', listener, { priority: 1000 })     // this listener will be called first

Custom data
	
	foo.on('bar', event => console.log(event.secret))
	foo.dispatchEvent('bar', { secret: 'baz' })

Regexp

	foo.on(/bar|baz/, listener)
	foo.off(/bar|baz/, listener) // cancel (regexp match uses String representation: String(regexp))

Bubbling, propagation through a delegate 'propagateTo'
	
	// propagateTo could return any of (null | object | [object])
	child.dispatchEvent('born', null, { propagateTo: child => child.parent })

test page: [event.html](http://htmlpreview.github.io/?https://github.com/jniac/js-utils/blob/master/test/event.html)  
