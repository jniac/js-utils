# js-utils
Javascript utilies for common needs (events, math etc.)

# event.js
EventDispatcher that can be herited or implemented (`Foo extends eventjs.EventDispatcher, eventjs.implementEventDispatcher(Foo.prototype)`).  
Regexp (`foo.on(/bar|baz/, listener)`)  
Shorthands (on/once/off, optional when choosing implementation instead inheritance)  
Priority (`foo.on('bar', listener, { priority: 1000 })`)  
test page: [event.html](http://htmlpreview.github.io/?https://github.com/jniac/js-utils/blob/master/test/event.html)  
