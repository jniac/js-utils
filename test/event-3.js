import * as eventjs from '../src/event.js'
export { eventjs }

log.toConsole = false

;(async function() {

	let code = await load('event-3-testline.js')

	let steps = code.split(/\/\/ TEST.*\n/).filter(v => /\S/.test(v))
	let titles = code.match(/\/\/ TEST.*\n/g).map(v => v.slice('// TEST - '.length))

	for (let [index, step] of steps.entries()) {

		// let a = step.match(/[\s\S]*?log\.assert[\s\S]*?\n\n/gm).map(v => v.trim())

		// let b = []

		// for (let [i, v] of a.entries()) {

		// 	let comment = `log.comment(\`${v.replace(/`/g, '\\`')}\`)`
		// 	b.push(comment)

		// 	b.push(v)

		// }

		// eval(b.join('\n'))




		log.title(titles[index])

		let a = step.split(/\/\/\slog.break\n/g)

		let b = []

		for (let v of a) {

			let comment = `log.comment(\`${v.trim().replace(/`/g, '\\`')}\`)`
			b.push(comment)
			b.push(v)

		}

		eval(b.join('\n'))

	}

})()



