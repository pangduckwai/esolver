import { solve } from './solve.js';

const a = 2916;
(() => {
	if (process.argv.length !== 8 || process.argv[2] === '--help'|| process.argv[2] === '-h') {
		console.log(
'Usage:\n' +
' npm run push --- {x1} {y1} {x2} {y2} {from} {to}\n' +
'  - x1 -> starting value of x\n' +
'  - y1 -> desired y value given x1\n' +
'  - x2 -> ending value of x\n' +
'  - y2 -> desired y value given x2\n' +
'  - from -> start of range of x value used\n' +
'  - to -> end of range of x value used'
		);
		process.exit(1);
	}

	const hdr = ['h', 'f(h)'];
	const x1 = +process.argv[2];
	const x2 = +process.argv[4];
	const y1 = +process.argv[3];
	const y2 = +process.argv[5];
	const fm = +process.argv[6];
	const to = +process.argv[7];

	solve(2, {fm, to}, ((t) => t*t + x1*t + x2*t + x1*x2 - ((a*(x2 - x1))/(y2 - y1))), hdr);
	solve(2, {fm, to}, ((t) => t*t - y2*t - y1*t + y1*y2 - ((a*(y2 - y1))/(x2 - x1))), hdr);
})();
