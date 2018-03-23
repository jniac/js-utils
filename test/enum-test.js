
import { Enum } from '../src/enum.js'

let TestEnum = new Enum('FOO', 'BAR', 'baz')

function test(str) {

    let result = eval(str)
    console.log(`${str} => `.padEnd(40, ' '), result)

}

test(`TestEnum`)
test(`TestEnum.FOO`)
test(`TestEnum.FOO.is.FOO`)
test(`TestEnum.FOO.is.BAR`)
test(`TestEnum.FOO.test('FOO')`)
test(`TestEnum.FOO.test(TestEnum.FOO)`)
test(`TestEnum.FOO.test('foo')`)
test(`TestEnum.FOO.test('foo', { ignoreCase: true })`)
test(`TestEnum.FOO.test(/foo/i)`)
test(`TestEnum.FOO.test(/fo/i)`)
test(`[...TestEnum]`)
test(`[...TestEnum.keys()]`)
