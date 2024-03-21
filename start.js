import { solve } from './solve.js';
import { parseArgs } from './utils.js';

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

(() => {
	const config = parseArgs({
		from: { D: -1000, M: "start of the range of x to use" },
		to: { D: 1000, M: "end of the range of x to use" },
		order: { D: 0, R: true, M: "order of the equation to be solved" },
		func: { D: '', R: true, M: "fucntion representing the equation to be solved" },
		step: { D: 1.0, M: "amount of x to increment for each iteration" },
		verbose: { D: 'verbose', M: "verbose level", E: "debug|verbose|silence" },
		headers: { D: ['X', 'Y'], M: "header to use in the output table, in comma separated string" },
	});
	if (!config) process.exit(1);
	solve(config.order, { from: config.from, to: config.to }, config.step, eval(config.func), config.headers, { debug: -1, verbose: 0, silence: 1 }[config.verbose]);
})();

/* Run samples:
npm start --- --order 3 --func "x => x*x*x - x*x - 5*x - 3"
npm start --- --order 3 --func "x => x*x*x + 6*x*x + 11*x + 6"
npm start --- --order 3 --func "x => x*x*x - 10*x*x - 500*x - 3000"
npm start --- --order 3 --func "x => x*x*x + 20*x*x - 500*x - 6000"
npm start --- --order 3 --func "x => x*x*x - 700*x - 6000"
npm start --- --order 3 --func "x => x*x*x + 19*x*x - 508*x - 5700" --step 0.001
npm start --- --order 2 --func "(t) => { let x1=0,y1=3,x2=100,y2=30; return t*t + x1*t + x2*t + x1*x2 - ((2916*(x2 - x1))/(y2 - y1)); }" --headers "h,f(h)"
npm start --- --order 2 --func "(t) => { let x1=0,y1=3,x2=100,y2=30; return t*t - y2*t - y1*t + y1*y2 - ((2916*(y2 - y1))/(x2 - x1)); }" --headers "k,f(k)"
 */
