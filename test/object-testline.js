
// IMPORT

import * as objectjs from '../src/object.js'

Object.assign(window, {

	objectjs,
	foo: { name: 'foo' },

})





// TEST - NumberProperty

foo.barProp = new objectjs.NumberProperty(0, { infinite: true }).link('bar', foo).onChange(value => log(value))
foo.bar = 2

// log.break

log.assert(`must be written "2" above`, log.last === '2')

// log.break

foo.barProp.onThrough(1.5, (sign, threshold, value) => log(`sign: ${sign}, current value: ${value}, threshold: ${threshold}`))
foo.bar = 1

// log.break

log.assert(`must be written "sign: -1, current value: 1, threshold: 1.5" above`, log.last === 'sign: -1, current value: 1, threshold: 1.5')

// log.break

foo.bar = 3




// TEST - BooleanProperty

let p = new objectjs.BooleanProperty(true).link('enabled', foo).onChange(value => log(value))
p.value = false
p.value = false
p.value = true

// log.break


