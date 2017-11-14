# js-utils
Javascript utilies for common needs (events, math, tree etc.)

# event.js
A very permissive EventDispatcher.   
```
import * as eventjs from './event.js'
```

EventDispatcher can be herited or implemented (and even none of that):
```
class Foo extends eventjs.EventDispatcher { ... }
```
_or_
``` 
eventjs.implementEventDispatcher(Foo.prototype)
```
_or_
``` 
let foo = {}
eventjs.implementEventDispatcher(foo)
```
_or_
``` 
let foo = eventjs.implementEventDispatcher({
    member1: value1,
    ...
})
```

### features:

__Shorthands__
<br> (on/once/off, optional when choosing implementation instead inheritance) 
```
foo.on('bar', listener)
foo.once('baz', listener)
foo.off('bar', listener)    // remove one listener
foo.off('bar')              // remove all listeners that listen 'bar'
```

<br> __Priority__
<br>
```
foo.on('bar', listener)
foo.on('bar', listener, { priority: 1000 })     // this listener will be called first
```

<br> __Max__
<br> when adding a listener, max option allow to restrict the number of execution
<br> default value: max = Infinity 
```
foo.on('bar', listener, { max: 1 })
// ===
foo.once('bar', listener)
```

<br> __Custom data__
<br>
```
foo.on('bar', event => console.log(event.secret))
foo.dispatchEvent('bar', { secret: 'baz' })
```

<br> __Regexp__
<br>
```
foo.on(/bar|baz/, listener)
foo.dispatchEvent('bar')           // caught by listener
foo.dispatchEvent('baz')           // caught by listener
foo.dispatchEvent('a-baz-event')   // caught by listener
foo.off(/bar|baz/, listener)       // cancel (regexp match uses String representation: String(regexp))
```

<br> __Bubbling / propagation__
<br> thanks to delegate 'propagateTo' the event know to which object propagate
<br> _event.target_: a reference to the first object that dispatch the event
<br> _event.currentTarget_: a reference to the current object that is currently dispatching the event
```
// propagateTo could return any of (null | object | [object])
parent.on('born', event => console.log('a new child is born!', event.target))
child.dispatchEvent('born', null, { propagateTo: child => child.parent })
```
if the event is cloned during propagation (since propagation can be from one object to multiple ones), the clone keeps the same custom properties:
```
root.on('event', event => console.log(event.branchMessage))  // will print `hello i'm a branch`
branch.on('event' => event.branchMessage = `hello i'm a branch`)
leave.dispatchEvent('event', null, { propagateTo: node => node.parent })
```

<br> __Cancelling an event__
<br> smooth...
```
foo.on('an-event', event => console.log(event))
foo.on('an-event', event => event.cancel(), { priority: 100 })
foo.dispatchEvent('an-event')        // trigger nothing
```

<br> __Remap__
<br> _dispatchEvent_ is already declared on my prototype, can i choose another key ?
<br> yes you can!
```
// remap key one by one
eventjs.implementEventDispatcher(MyClass.prototype, {
    remap: {
        dispatchEvent: 'trigger',
    },
})
myInstance.trigger('an-event')       // do the job!
```
_or_
```
// remap key with a callback
eventjs.implementEventDispatcher(MyClass.prototype, {
    remap: key => `__${key}__`,
})
myInstance.__dispatchEvent__('an-event')       // do the job!
```


<br> __Without implement or inherit__
<br> to propagate an event through a existing tree, tree's nodes do not even have to implement eventjs.EventDispatcher:
<br> on/once/off/dispatchEvent can be called from eventjs directly
<br> alteration: 
<br> •&nbsp;&nbsp;&nbsp;&nbsp; eventjs.on(targets, ...) will create an array on targets: target[eventjs.listenersKey]
<br> •&nbsp;&nbsp;&nbsp;&nbsp; eventjs.dispatchEvent(targets, ...) let everything clean
```
// e.g. down from <body> to every HTMLElement
eventjs.on(document.querySelector('#A'), 'an-event', event => console.log(event))
eventjs.dispatchEvent(document.body, 'an-event', null, { propagateTo: element => element.children })
```
when called from eventjs, on/once/off/dispatchEvent can been invoked for multiple targets (Array, List, anything iterable)
```
eventjs.on(document.querySelectorAll('form'), 'changed', event => {
    event.currentTarget.classList.add('changed')
    event.cancel()
})
eventjs.dispatchEvent(document.querySelectorAll('form input'), 'changed')
```

<br> __Clear__
<br>
```
foo.clearEventListeners()
foo.getEventListeners().length // === 0
```
_or_
```
eventjs.clearEventListeners(foo)
eventjs.getEventListeners(foo).length // === 0
```

test page: [event.html](http://htmlpreview.github.io/?https://github.com/jniac/js-utils/blob/master/test/event.html)  
