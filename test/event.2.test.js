import * as eventjs from '../src/event.2.js'
export { eventjs }



function log() {
	
	console.log.apply(console, arguments)

}









eventjs.on(window, 'test', event => {

	console.log(event.type)

})

eventjs.dispatchEvent(window, 'test')

eventjs.off(window, 'test')

eventjs.dispatchEvent(window, 'test')





// REGEXP, MAX, PRIORITY, MULTIPLE EVENTS

eventjs.on(window, /foo|bar/, event => {

	if (event.type === 'foo') {

		console.log('hello, i\'m ' + event.type)

	} else {

		console.log('so you want ? sure, but you gotta be lonely to the ' + event.type + ', i\'m leaving')

	}

}, { max: 2 })

eventjs.on(window, /b.r/, event => {

	console.log('wanna be first to the ' + event.type)

}, { priority: 100 })

// dispatch multiple event
eventjs.dispatchEvent(window, 'foo bar')
eventjs.dispatchEvent(window, 'foo bar')
eventjs.dispatchEvent(window, 'foo bar')
eventjs.dispatchEvent(window, 'foo bar')





// MULTIPLE TARGETS, PROPAGATION, CUSTOM DATA

// ascending, multiple targets, multiple events
eventjs.once(document.querySelectorAll('.dom .blue'), 'click tap', event => console.log(event.type, event.data, event.target, event.currentTarget))
eventjs.dispatchEvent(document.querySelectorAll('.dom .letter'), 'click', { data: Math.random(), propagateTo: node => node.parentNode })
eventjs.dispatchEvent(document.querySelectorAll('.dom .letter'), 'tap', { data: Math.random(), propagateTo: node => node.parentNode })
eventjs.dispatchEvent(document.querySelectorAll('.dom .letter'), 'tap', { data: Math.random(), propagateTo: node => node.parentNode })
eventjs.dispatchEvent(document.querySelectorAll('.dom .letter'), 'tap', { data: Math.random(), propagateTo: node => node.parentNode })

// descending, multiple targets
eventjs.once(document.querySelectorAll('.dom .letter'), 'down', event => console.log(event.type, event.data, event.target, event.currentTarget))
eventjs.dispatchEvent(document.querySelector('.dom'), 'down', { data: Math.random(), propagateTo: node => node.children })
eventjs.dispatchEvent(document.querySelector('.dom'), 'down', { data: Math.random(), propagateTo: node => node.children })
eventjs.dispatchEvent(document.querySelector('.dom'), 'down', { data: Math.random(), propagateTo: node => node.children })
eventjs.dispatchEvent(document.querySelector('.dom'), 'down', { data: Math.random(), propagateTo: node => node.children })








// EXTENDS, THIS, CHAINING

export class Foo extends eventjs.EventDispatcher {

	// ...

}

export let foo = new Foo()

.on(/bar/, function(event) {

	console.log(event.type, this)

}).dispatchEvent('bar')








// IMPLEMENTS, REMAP

let bar = {}

eventjs.implementEventDispatcher(bar)

bar.on('foo', function(event) {

	console.log(event.type, this)

})

bar.dispatchEvent('foo')



export let bar2 = {}

// remap keys, forgot one (addEventListener)
eventjs.implementEventDispatcher(bar2, { remap: {

	on: 'ON',
	off: 'OFF',
	dispatchEvent: 'TRIGGER',
	addEventListener: null,

} })

bar2.ON(/foo/, function(event) {

	console.log('remap', event.type, this)

})

bar2.TRIGGER('foo-2')



let bar3 = eventjs.implementEventDispatcher({}, { remap: k => `__${k}__` })

bar3.__on__('¯\\_(ツ)_/¯', event => console.log(event.type))

bar3.__dispatchEvent__('¯\\_(ツ)_/¯')









// THISARG, ARGUMENTS

class Show {

	constructor() {

		foo.on('BAR', this.onBar, { thisArg: this, args: ['me the way to the next', 'whisky'] })

	}

	onBar(event, lyrics, lyrics2) {

		console.log(this, lyrics, lyrics2, event.type)

	}

}

new Show()

foo.dispatchEvent('BAR')
foo.dispatchEvent('BAR')
foo.dispatchEvent('BAR')








// CANCELING

foo.on('BAR', function(event) {

	event.cancel()

}, { priority: 1 })

foo.dispatchEvent('BAR')
foo.dispatchEvent('BAR')
foo.dispatchEvent('BAR')



// CLEAR

console.log(foo.getAllListeners())
foo.clearEventListener()
console.log(foo.getAllListeners())



