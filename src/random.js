
function identity(x) {

	return x

}

export function between(min, max, f = identity) {

	return min + (max - min) * f(Math.random())

}

export function sign(p = .5) {

	return Math.random() < p ? 1 : -1

}

export function chance(p = .5) {

	return Math.random() < p

}

export function around(x, delta, f = identity) {

	return x + sign() * delta * f(Math.random()) 

}

