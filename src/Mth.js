
const toRadians = Math.PI / 180

const toDegrees = 180 / Math.PI

const clamp = (x, min = 0, max = 1) => x < min ? min : x > max ? max : x

const mix = (a, b, x, clamp = true) => a + (b - a) * (clamp ? (x < 0 ? 0 : x > 1 ? 1 : x) : x)

const mixObjects = (A, B, x, clamp = true) => {

	if (clamp)
		x = x < 0 ? 0 : x > 1 ? 1 : x

	let keys = Object.keys(A).filter(key => key in B)

	let object = {}

	for (let key of keys)
		object[key] = A[key] + (B[key] - A[key]) * x

	return object

}

const ratio = (x, min, max, clamp = true, remap = null) => {

	x = (x - min) / (max - min)

	if (clamp)
		x = x < 0 ? 0 : x > 1 ? 1 : x

	return remap ? remap(x) : x

}

const remap = (x, sourceMin, sourceMax, min = 0, max = 1, clamp = true) => {

	// clamp is quite complex because sourceMin is not necessary < sourceMax, e.g:
	// remap(x, 0, -2, 0, 1)
    if (clamp)
        x = sourceMin < sourceMax
        ? (x < sourceMin ? sourceMin : x > sourceMax ? sourceMax : x)
        : (x < sourceMax ? sourceMax : x > sourceMin ? sourceMin : x)

    return min + (max - min) * (x - sourceMin) / (sourceMax - sourceMin)

}

/**
 * signed power
 * The result has the same sign as x
 * spow(2, 2) === 4
 * spow(-3, 2) === -9
 * spow(-36, 1 / 2) === -6
 */
const spow = (x, power) => x >= 0 ? Math.pow(x, power) : -Math.pow(-x, power)

/**
 * returns an image of x where f(x) < limit
 * f(0) = 0
 * f(limit) = limit / 2
 * f(Infinity) = limit
 * f'(0) = 1
 * f'(limit) = 1/4 * limit
 * f'(Infinity) = 0
 */
const limit = (x, limit = 1, ratio = 1) => x * ratio * limit / (x * ratio + limit)

/**
 * https://jsfiddle.net/jniac/mwf019mg/
 * http://www.iquilezles.org/www/articles/functions/functions.htm
 * @param x: the value
 * @param a in coefficient
 * @param b out coefficient
 */
const pcurve = (x, a, b) => {

	let k = (a + b) ** (a + b) / ((a ** a) * (b ** b))

	return k * (x ** a) * ((1 - x) ** b)

}

/**
 * https://jsfiddle.net/jniac/1qpum68z/
 * @param x the value
 * @param p the power
 * @param m the middle of the ease
 */
const gain = (x, p = 3, i = .5, clamp = true) => {

	if (clamp)
		x = x < 0 ? 0 : x > 1 ? 1 : x

	return x === i
		? x
		: x < i
		? 1 / Math.pow(i, p - 1) * Math.pow(x, p)
		: 1 - 1 / Math.pow(1 - i, p - 1) * Math.pow(1 - x, p)

}

/**
 * binded version of gain(), usage:
 * f = gainBind(3, 1/3)
 * y = f(x)
 */
const gainBind = (p = 3, i = .5, clamp = true) => x => {

	if (clamp)
		x = x < 0 ? 0 : x > 1 ? 1 : x

	return x === i
		? x
		: x < i
		? 1 / Math.pow(i, p - 1) * Math.pow(x, p)
		: 1 - 1 / Math.pow(1 - i, p - 1) * Math.pow(1 - x, p)

}


/**
 * map [0, 1] to [0, Infinity]
 * infinity(0) = 0
 * infinity(1/2) = 1
 * infinity(1) = Infinity
 */
const infinity = x => (x = 1 / (1 - x) - 1) * x

const infinityPrime = x => -2 * x / ((x = x - 1) * x * x)

const infinityPrimeAngle = x => Math.atan(-2 * x / ((x = x - 1) * x * x))

const distanceXY = (x, y) => Math.sqrt(x * x + y * y)

const distanceXYZ = (x, y, z) => Math.sqrt(x * x + y * y + z * z)

/**
 * Convenient but sub-performant method for distance calculations
 * distance(3, 4) === 5
 * distance({ x: 1, y: 2 }, { x: 4, y: 6 }) === 5
 * distance({ x: 1, y: 2 }, { x: 4, y: 6 }, { x: 4, y: 3 }) === 8
 */
const distance = (...args) => {

	if (typeof args[0] === 'object') {

		let A = args.shift()
		let sum = 0

		if (!A)
			return NaN

		for (let B of args) {

			if (!B)
				return NaN

			sum += distance(B.x - A.x, B.y - A.y, B.z - A.z || undefined)
			A = B

		}

		return sum

	}

	let sum = args.reduce((r, v) => r + (isNaN(v) ? 0 : v * v), 0)

	return Math.sqrt(sum)

}



// generators:

/**
 * Python like
 *
 * for (let x of range(5))
 *     ... // 0, 1, 2, 3, 4
 *
 */
function* range(n) {

	let i = 0

	while(i < n)
		yield i++

}

/**
 * Example:
 *
 * for (let x of step(100, 110))
 *     ... // 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110
 *
 * for (let x of step(100, 100, { step: 2 }))
 *     ... // 100, 102, 104, 106, 108, 110
 *
 * for (let x of step(100, 100, { count: 3 }))
 *     ... // 100, 105, 110
 *
 */
function* step(start, end, { offset = 0, step = 1, count, includeEnd = true, returnIndex = false } = {}) {

	let d = end - start

	start += offset

	if (count === undefined)
		count = Math.ceil(d / step)

	if (includeEnd) {

		for (let i = 0; i <= count; i++)
			yield returnIndex ? [i, start + d * i / count] : start + d * i / count

	} else {

		for (let i = 0; i < count; i++)
			yield returnIndex ? [i, start + d * i / count] : start + d * i / count

	}

}


export default {

	toDegrees,
	toRadians,
	clamp,
	mix,
	mixObjects,
	ratio,
	remap,
	spow,
	limit,
	pcurve,
	gain,
	gainBind,
	infinity,
	infinityPrime,
	infinityPrimeAngle,
	distanceXY,
	distanceXYZ,
	distance,

	range,
	step,

}
