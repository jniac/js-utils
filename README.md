# js-utils
Javascript utilies for common needs (events, math, tree etc.)

# event.js
A very permissive EventDispatcher.   

EventDispatcher that can be herited or implemented (and even none of that):
```
class Foo extends eventjs.EventDispatcher { ... }
 
eventjs.implementEventDispatcher(Foo.prototype)

let foo = {}
eventjs.implementEventDispatcher(foo)
 
let foo = eventjs.implementEventDispatcher({
	member1: value1,
	...
})
```

### features:

__Shorthands__<br>
(on/once/off, optional when choosing implementation instead inheritance) 
```
foo.on('bar', listener)
foo.once('baz', listener)
foo.off('bar', listener)    // remove one listener
foo.off('bar')              // remove all listeners that listen 'bar'
```

__Priority__<br>
```
foo.on('bar', listener)
foo.on('bar', listener, { priority: 1000 })     // this listener will be called first
```

__Max__<br>
when adding a listener, max option allow to restrict the number of execution
default value: max = Infinity 
```
foo.on('bar', listener, { max: 1 })
// ===
foo.once('bar', listener)
```

__Custom data__<br>
```
foo.on('bar', event => console.log(event.secret))
foo.dispatchEvent('bar', { secret: 'baz' })
```

__Regexp__<br>
```
foo.on(/bar|baz/, listener)
foo.dispatchEvent('bar')           // caught by listener
foo.dispatchEvent('baz')           // caught by listener
foo.dispatchEvent('a-baz-event')   // caught by listener
foo.off(/bar|baz/, listener)       // cancel (regexp match uses String representation: String(regexp))
```

__Bubbling / propagation__<br>
thanks to delegate 'propagateTo' the event know to which object propagate
event.target: a reference to the first object that dispatch the event
event.currentTarget: a reference to the current object that is currently dispatching the event
```
// propagateTo could return any of (null | object | [object])
parent.on('born', event => console.log('a new child is born!', event.target))
child.dispatchEvent('born', null, { propagateTo: child => child.parent })
```

__Cancel event__<br>
```
foo.on('an-event', event => console.log(event))
foo.on('an-event', event => event.cancel(), { priority: 100 })
foo.dispatchEvent('an-event')		// trigger nothing
```


__Without implement or inherit__<br>
to propagate an event through a existing tree, nodes tree do not even have to implement eventjs.EventDispatcher:<br>
on/once/off/dispatchEvent can be called from eventjs directly
```
// e.g. down from <body> to every HTMLElement
eventjs.on(document.querySelector('#A'), 'an-event', event => console.log(event))
eventjs.dispatchEvent(document.body, 'an-event', null, { propagateTo: element => element.children })
```

test page: [event.html](http://htmlpreview.github.io/?https://github.com/jniac/js-utils/blob/master/test/event.html)  
