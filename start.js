import { _solve, solve } from './solve.js';

/**
	Equations: ()x³ + ()x² + ()x + 0

	(x + 1)(x + 1)(x - 3) => x³ - x² - 5x - 3

	(x + 1)(x - 2)(x + 3) => x³ + 2x² - 5x - 6

	(x + 1)(x + 2)(x + 3) => x³ + 6x² + 11x + 6

	(x + 1)(x + 2)(x - 3) => x³ - 7x - 6

	(x + 10)(x + 10)(x - 30) => x³ - 10x² - 500x - 3000

	(x + 10)(x - 20)(x + 30) => x³ + 20x² - 500x - 6000

	(x + 10)(x + 20)(x + 30) => x³ + 60x² + 1100x + 6000

	(x + 10)(x + 20)(x - 30) => x³ - 700x - 6000
 */

/**
 	Samples:
	npm start --- -1000 1000 2 "(t) => { let x1=0,y1=3,x2=100,y2=30; return t*t + x1*t + x2*t + x1*x2 - ((2916*(x2 - x1))/(y2 - y1)); }" verbose "h,f(h)"
	npm start --- -1000 1000 2 "(t) => { let x1=0,y1=3,x2=100,y2=30; return t*t - y2*t - y1*t + y1*y2 - ((2916*(y2 - y1))/(x2 - x1)); }" verbose "k,f(k)"
 */

(() => {
	if (process.argv.length < 6 || process.argv.length > 8 || process.argv[2] === '--help'|| process.argv[2] === '-h') {
		console.log(
'Usage:\n' +
' npm start --- {from} {to} {order} {func} [verbose]\n' +
'  - from -> start of range of x value used\n' +
'  - to -> end of range of x value used\n' +
'  - order -> order of the equation\n' +
'  - func -> fucntion of the equation to be solved\n' +
'  - verbose -> accepted values: "debug", "verbose", "silence"\n' +
'  - header -> comma separated list of string, header to use in the output table'
		);
		process.exit(1);
	}

	const from = +process.argv[2];
	const to = +process.argv[3];
	const od = +process.argv[4];
	const fn = process.argv[5];
	const vb = (process.argv.length >= 7) ? process.argv[6] : undefined;
	const hr = (process.argv.length === 8) ? process.argv[7] : undefined;

	let verbose
	switch (vb) {
		case 'debug':
			verbose = -1;
			break;
		case 'verbose':
			verbose = 0;
			break;
		case 'silence':
			verbose = 1;
			break;
	}

	const hdr = (!!hr) ? hr.split(',') : null;

	solve(od, {from, to}, eval(fn), hdr, verbose);
})();
