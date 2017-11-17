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









