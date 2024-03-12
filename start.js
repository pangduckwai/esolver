import { _solve, solve } from './solve.js';

(() => {
	if (process.argv.length !== 6 || process.argv[2] === '--help'|| process.argv[2] === '-h') {
		console.log(
'Usage:\n' +
' npm start --- {from} {to} {order} {func}\n' +
'  - from -> start of range of x value used\n' +
'  - to -> end of range of x value used\n' +
'  - order -> order of the equation\n' +
'  - func -> fucntion of the equation to be solved'
		);
		process.exit(1);
	}

	const fm = +process.argv[2];
	const to = +process.argv[3];
	const od = +process.argv[4];
	const fn = process.argv[5];

	// solve(od, {fm, to}, eval(fn));
	_solve(od, {fm, to}, eval(fn), -1);
})();
