let csscolors = {

	aliceblue: '#f0f8ff',
	antiquewhite: '#faebd7',
	aqua: '#00ffff',
	aquamarine: '#7fffd4',
	azure: '#f0ffff',
	beige: '#f5f5dc',
	bisque: '#ffe4c4',
	black: '#000000',
	blanchedalmond: '#ffebcd',
	blue: '#0000ff',
	blueviolet: '#8a2be2',
	brown: '#a52a2a',
	burlywood: '#deb887',
	cadetblue: '#5f9ea0',
	chartreuse: '#7fff00',
	chocolate: '#d2691e',
	coral: '#ff7f50',
	cornflowerblue: '#6495ed',
	cornsilk: '#fff8dc',
	crimson: '#dc143c',
	cyan: '#00ffff',
	darkblue: '#00008b',
	darkcyan: '#008b8b',
	darkgoldenrod: '#b8860b',
	darkgray: '#a9a9a9',
	darkgreen: '#006400',
	darkgrey: '#a9a9a9',
	darkkhaki: '#bdb76b',
	darkmagenta: '#8b008b',
	darkolivegreen: '#556b2f',
	darkorange: '#ff8c00',
	darkorchid: '#9932cc',
	darkred: '#8b0000',
	darksalmon: '#e9967a',
	darkseagreen: '#8fbc8f',
	darkslateblue: '#483d8b',
	darkslategray: '#2f4f4f',
	darkslategrey: '#2f4f4f',
	darkturquoise: '#00ced1',
	darkviolet: '#9400d3',
	deeppink: '#ff1493',
	deepskyblue: '#00bfff',
	dimgray: '#696969',
	dimgrey: '#696969',
	dodgerblue: '#1e90ff',
	firebrick: '#b22222',
	floralwhite: '#fffaf0',
	forestgreen: '#228b22',
	fuchsia: '#ff00ff',
	gainsboro: '#dcdcdc',
	ghostwhite: '#f8f8ff',
	gold: '#ffd700',
	goldenrod: '#daa520',
	gray: '#808080',
	green: '#008000',
	greenyellow: '#adff2f',
	grey: '#808080',
	honeydew: '#f0fff0',
	hotpink: '#ff69b4',
	indianred: '#cd5c5c',
	indigo: '#4b0082',
	ivory: '#fffff0',
	khaki: '#f0e68c',
	lavender: '#e6e6fa',
	lavenderblush: '#fff0f5',
	lawngreen: '#7cfc00',
	lemonchiffon: '#fffacd',
	lightblue: '#add8e6',
	lightcoral: '#f08080',
	lightcyan: '#e0ffff',
	lightgoldenrodyellow: '#fafad2',
	lightgray: '#d3d3d3',
	lightgreen: '#90ee90',
	lightgrey: '#d3d3d3',
	lightpink: '#ffb6c1',
	lightsalmon: '#ffa07a',
	lightseagreen: '#20b2aa',
	lightskyblue: '#87cefa',
	lightslategray: '#778899',
	lightslategrey: '#778899',
	lightsteelblue: '#b0c4de',
	lightyellow: '#ffffe0',
	lime: '#00ff00',
	limegreen: '#32cd32',
	linen: '#faf0e6',
	magenta: '#ff00ff',
	maroon: '#800000',
	mediumaquamarine: '#66cdaa',
	mediumblue: '#0000cd',
	mediumorchid: '#ba55d3',
	mediumpurple: '#9370db',
	mediumseagreen: '#3cb371',
	mediumslateblue: '#7b68ee',
	mediumspringgreen: '#00fa9a',
	mediumturquoise: '#48d1cc',
	mediumvioletred: '#c71585',
	midnightblue: '#191970',
	mintcream: '#f5fffa',
	mistyrose: '#ffe4e1',
	moccasin: '#ffe4b5',
	navajowhite: '#ffdead',
	navy: '#000080',
	oldlace: '#fdf5e6',
	olive: '#808000',
	olivedrab: '#6b8e23',
	orange: '#ffa500',
	orangered: '#ff4500',
	orchid: '#da70d6',
	palegoldenrod: '#eee8aa',
	palegreen: '#98fb98',
	paleturquoise: '#afeeee',
	palevioletred: '#db7093',
	papayawhip: '#ffefd5',
	peachpuff: '#ffdab9',
	peru: '#cd853f',
	pink: '#ffc0cb',
	plum: '#dda0dd',
	powderblue: '#b0e0e6',
	purple: '#800080',
	rebeccapurple: '#663399',
	red: '#ff0000',
	rosybrown: '#bc8f8f',
	royalblue: '#4169e1',
	saddlebrown: '#8b4513',
	salmon: '#fa8072',
	sandybrown: '#f4a460',
	seagreen: '#2e8b57',
	seashell: '#fff5ee',
	sienna: '#a0522d',
	silver: '#c0c0c0',
	skyblue: '#87ceeb',
	slateblue: '#6a5acd',
	slategray: '#708090',
	slategrey: '#708090',
	snow: '#fffafa',
	springgreen: '#00ff7f',
	steelblue: '#4682b4',
	tan: '#d2b48c',
	teal: '#008080',
	thistle: '#d8bfd8',
	tomato: '#ff6347',
	turquoise: '#40e0d0',
	violet: '#ee82ee',
	wheat: '#f5deb3',
	white: '#ffffff',
	whitesmoke: '#f5f5f5',
	yellow: '#ffff00',
	yellowgreen: '#9acd32',

}





let re = {

	rgba: /rgba.(\d+)[\s|,]+(\d+)[\s|,]+(\d+)[\s|,]+([\d|\.]+)/,
	rgb: /rgb.(\d+)[\s|,]+(\d+)[\s|,]+(\d+)/,
	hsl: /hsl.(\d+)[\s|,]+(\d+)%[\s|,]+(\d+)%/,

}

function clamp(x, min = 0, max = 1) {

	return x < min ? min : x > max ? max : x

}

function hue2rgb(p, q, t){

	if (t < 0) 
		t += 1
	
	if (t > 1) 
		t -= 1
	
	if (t < 1 / 6) 
		return p + (q - p) * 6 * t
	
	if (t < 1 / 2) 
		return q
	
	if (t < 2 / 3) 
		return p + (q - p) * (2 / 3 - t) * 6
	
	return p

}

export class Color {

	static mix(color1, color2, q) {

		let q2 = 1 - q
		let c = new Color()

		c.r = color1.r * q2 + color2.r * q
		c.g = color1.g * q2 + color2.g * q
		c.b = color1.b * q2 + color2.b * q
		c.a = color1.a * q2 + color2.a * q

		return c

	}
	
	constructor() {

		this.set(1, 1, 1, 1)
		this.set(...arguments)

	}

	copy(other) {

		this.r = other.r
		this.g = other.g
		this.b = other.b
		this.a = other.a

		return this

	}

	clone() {

		return new Color().copy(this)

	}

	set(color) {

		if (color instanceof Color)
			return this.copy(color)

		if (typeof color === 'string') {

			if (/^\w+$/.test(color))
				color = csscolors[color]

			if (color[0] === '#') {

				color = color.slice(1)

				if (color.length === 3)
					return this.setRGB(...color.split('').map(v => Number('0x' + v) / 0xf))

				if (color.length === 4)
					return this.setRGBA(...color.split('').map(v => Number('0x' + v) / 0xf))

				if (color.length === 6)
					return this.setRGB(...color.match(/.{2}/g).map(v => Number('0x' + v) / 0xff))

				if (color.length === 8)
					return this.setRGBA(...color.match(/.{2}/g).map(v => Number('0x' + v) / 0xff))

			}

			if (color.slice(0, 4) === 'rgba') {

				let [, r, g, b, a] = color.match(re.rgba) || [, 255, 255, 255, 1]
				return this.setRGBA(r / 255, g / 255, b / 255, a)

			}

			if (color.slice(0, 3) === 'rgb') {

				let [, r, g, b] = color.match(re.rgb) || [, 255, 255, 255]
				return this.setRGB(r / 255, g / 255, b / 255)

			}

			if (color.slice(0, 3) === 'hsl') {

				let [, h, s, l] = color.match(re.hsl) || [, 0, 100, 50]
				return this.setHSL(h / 360, s / 100, l / 100)

			}

		}

		if (arguments.length === 3)
			return this.setRGB(...arguments)

		if (arguments.length === 4)
			return this.setRGBA(...arguments)

		return this

	}

	setRGB(r, g, b) {

		this.r = parseFloat(r) || 0
		this.g = parseFloat(g) || 0
		this.b = parseFloat(b) || 0

		return this

	}

	setRGBA(r, g, b, a) {

		this.r = parseFloat(r) || 0
		this.g = parseFloat(g) || 0
		this.b = parseFloat(b) || 0
		this.a = parseFloat(a) || 0

		return this

	}

	setAlpha(a) {

		this.a = a

		return this

	}

	setHSL(h, s, l) {

		if (s === 0) {

			this.r = l
			this.g = l
			this.b = l

		} else {

			let q = l < 0.5 ? l * (1 + s) : l + s - l * s
			let p = 2 * l - q

			this.r = hue2rgb(p, q, h + 1/3)
			this.g = hue2rgb(p, q, h)
			this.b = hue2rgb(p, q, h - 1/3)

		}

		return this

	}

	getHSL() {

		let h, s, l
		let r = this.r, g = this.g, b = this.b

		let min = Math.min(r, g, b)
		let max = Math.max(r, g, b)

		l = (min + max) / 2

		if (min === max) {

			h = 0
			s = 0

		} else {

			let d = max - min

			s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

			switch(max) {

				case r: h = (g - b) / d + (g < b ? 6 : 0); break
				case g: h = (b - r) / d + 2; break
				case b: h = (r - g) / d + 4; break

			}

			h /= 6

		}

		return [h, s, l]

	}

	get r255() { return Math.round(clamp(this.r) * 0xff) }
	get g255() { return Math.round(clamp(this.g) * 0xff) }
	get b255() { return Math.round(clamp(this.b) * 0xff) }
	get a255() { return Math.round(clamp(this.a) * 0xff) }

	getRGBString() {

		return `rgb(${this.r255}, ${this.g255}, ${this.b255}})`

	}

	get rgbString() { return this.getRGBString() }

	getRGBAString(alphaPrecision = 3) {

		return `rgba(${this.r255}, ${this.g255}, ${this.b255}, ${this.a.toFixed(alphaPrecision)})`

	}

	get rgbaString() { return this.getRGBAString() }

	getHexString({ prefix = '#', alpha = false } = {}) {

		return prefix 
			+ this.r255.toString(16).padStart(2, '0')
			+ this.g255.toString(16).padStart(2, '0')
			+ this.b255.toString(16).padStart(2, '0')
			+ (alpha ? this.a255.toString(16).padStart(2, '0') : '')

	}

	get hexString() { return this.getHexString() }

	getHSLString() {

		let [h, s, l] = this.getHSL()

		return `hsl(${Math.round(360 * h)}, ${Math.round(100 * s)}%, ${Math.round(100 * l)}%)`

	}

	get hslString() { return this.getHSLString() }

}







export function newColor() {

	return new Color(...arguments)

}

let __c1 = new Color()
let __c2 = new Color()

export function rgba(color) {

	return __c1.set(...arguments).getRGBAString()

}

export function mix(color1, color2, ratio) {

	__c1.set(color1)
	__c2.set(color2)
	return Color.mix(__c1, __c2, ratio)

}

export function randomColor(color1, color2) {

	if (color1 && color2)
		mix(color1, color2, Math.random())

	return new Color(Math.random(), Math.random(), Math.random())

}

export function get(color) {

	return new Color(color)

}







