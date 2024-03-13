import { _solve, solve } from './solve.js';

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
