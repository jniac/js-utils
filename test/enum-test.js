
import { Enum } from '../src/enum.js'

function test(str) {

    let result = eval(str)
    console.log(`${str} => `.padEnd(40, ' '), result)

}

let FooEnum = new Enum('FOO', 'BAR', 'baz')

test(`FooEnum`)
test(`FooEnum.FOO`)
test(`FooEnum.FOO.is.FOO`)
test(`FooEnum.FOO.is.BAR`)
test(`FooEnum.FOO.test('FOO')`)
test(`FooEnum.FOO.test(FooEnum.FOO)`)
test(`FooEnum.FOO.test('foo')`)
test(`FooEnum.FOO.test('foo', 'i')`)
test(`FooEnum.FOO.test(/foo/i)`)
test(`FooEnum.FOO.test(/fo/i)`)
test(`[...FooEnum]`)
test(`[...FooEnum.keys()]`)

let Direction = new Enum('VERTICAL|VERT|V', 'HORIZONTAL|HORZ|H', 'BOTH FREE')

console.log(Direction)
test(`Direction.VERTICAL`)
test(`[...Direction]`)
test(`[...Direction.VERTICAL.keys()].join(' ')`)
test(`[...Direction.keys()].join(' ')`)
test(`Direction.VERTICAL.is`)
test(`Direction.VERTICAL.is.VERTICAL`)
test(`Direction.VERTICAL.is.VERT`)
test(`Direction.VERTICAL.test('V')`)
test(`Direction.VERTICAL.test('v')`)
test(`Direction.VERTICAL.test('v', 'i')`)
