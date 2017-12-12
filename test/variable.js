import { Variable } from '../../src/variable.js'
export { Variable }



export let variable = new Variable(2)

variable.newValue(4).newValue(6)

console.log(variable.getValues())
console.log(variable.derivative.getValues())
console.log(variable.derivative.growth)

variable.newValue(6)

console.log(variable.getValues())
console.log(variable.derivative.getValues())
console.log(variable.derivative.growth)
