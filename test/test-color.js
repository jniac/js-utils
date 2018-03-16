import * as colorjs from '../src/color.js'
import { Color } from '../src/color.js'
export { Color, colorjs }

function* step(start, end, { step = 1, count } = {}) {

	let d = end - start

	if (count === undefined)
		count = Math.ceil(d / step)

	for (let i = 0; i <= count; i++)
		yield start + d * i / count

}

function* range(n) {

	let i = 0

	while (i < n)
		yield i++

}

export let c1 = new colorjs.Color('goldenrod')

export function makeDiv(color) {

	color = Color.ensure(color)

	let div = document.createElement('div')

	Object.assign(div.style, {

		width: '200px',
		height: '20px',
		'background-color': color.RRGGBBAA,

	})

	document.body.append(div)

}

let color

color = Color.ensure()

color.luminosity *= .65
color.saturation *= .65


color = Color.ensure('gold')
makeDiv(color)

color.luminosity *= .8
makeDiv(color)

color.luminosity *= .8
makeDiv(color)

color = Color.ensure('gold')

for (let x of range(20))
	makeDiv(color.shiftHsl({ saturationGain: 1/4 }))

for (let x of range(20))
	makeDiv(color.shiftHsl({ saturationGain: 2 }))

