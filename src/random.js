
export function between(min, max) {

	return min + (max - min) * Math.random()

}

export function around(x, delta) {

	return x + (Math.random() > .5 ? -1 : 1) * delta * Math.random() 

}

