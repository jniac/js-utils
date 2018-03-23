import query from '../src/query.js'

let bob = {

	tags: {
		name: 'bob',
		type: 'human',
		age: 43,
		key: '123',
	},

	children: [

		{
			tags: {
				name: 'foo',
				type: 'human',
				age: 37,
			},

			children: [
				{
					tags: {
						name: 'qux',
						type: 'human',
						age: 3,
						key: 'pass',
					},
				}
			],
		},

		{
			tags: {
				name: 'bar',
				type: 'human',
				age: 23,
			}
		},

		{
			tags: {
				name: 'toto',
				type: 'human',
				age: 11,
				key: '456',
			}
		},

		{
			tags: {
				name: 'QXR',
				type: 'alien',
				age: Infinity,
			}
		},

	],

}

const ots = object => `{ ${Object.keys(object).map(k => k + ':' + object[k]).join(', ')} }`

function test(queryString) {

	let r = query(bob, queryString, { propsDelegate: 'tags' }).map(v => ots(v.tags)).join('\n')

	let str = queryString + '\n' + r + '\n\n'

	document.querySelector('pre.console').append(str)

	console.log(str)

}

window.bob = bob
test('*')
test('> *')
test('type')
test('type=human')
test('type=human age>20')
test('age>20000')
test('key')
test('* > type=human')
test('* > * > *')
