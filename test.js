import { parseArgs } from './utils.js';

(() => {
	const input = {
		from:    { D: -1000,                       M: "test numeric with default" },
		order:   { D: 0,         R: true,          M: "test required numeric" },
		func:    { D: '',        R: true,          M: "test required string" },
		verbose: { D: 'verbose',                   M: "test enum with default", E: "debug|verbose|silence" },
		test0:   { D: '',        R: true,          M: "test required enum",     E: "how|are|you" },
		test1:   { D: ['X','Y'],                   M: "test non-multiple with array default" },
		test2:   { D: 'X',                U: true, M: "test multiple with non-array default" },
		test3:   { D: [0, 1],             U: true, M: "test multipe with array default" },
		test4:   { D: 'X',       R: true, U: true, M: "test required multipe" },
	};

	const cfg = {};
	for (const key of Object.keys(input)) {
		cfg[key] = input[key].R ? (input[key].U ? [] : null) : (input[key].U && !Array.isArray(input[key].D) ? [input[key].D] : input[key].D);
	}

	const config = parseArgs(input);
	if (config) {
		console.log(`B4 ${JSON.stringify(cfg, null, 2)}`);
		console.log(`AFT ${JSON.stringify(config, null, 2)}`);
	}
})();

/* Test samples:
npm test                                                                             ; # Error: Argument 'order' required
npm test --- hello                                                                   ; # [show usage]
npm test --- --order 1                                                               ; # Error: Argument 'func' required
npm test --- --order 1 --func "x => x*x"                                             ; # Error: Argument 'test0' required
npm test --- --order 1 --func "x => x*x" --test0 how --verbose none                  ; # Error: Invalid value 'none' of argument 'verbose'
npm test --- --order 1 --func "x => x*x" --test0 hello                               ; # Error: Invalid value 'hello' of argument 'test0'
npm test --- --order 1 --test0 are --func "x => x*x" --test0 how                     ; # Error: Argument 'test0' already specified
npm test --- --order 1 2 --func "x => x*x" --test0 how                               ; # Error: Argument 'order' already specified
npm test --- --order 1 --func "x => x*x" --test0 how                                 ; # Error: Argument 'test4' required
npm test --- --order 1 --func "x => x*x" --test2 How are you --test0 how --test4 z   ; # [successful]
npm test --- --order 1 --func "x => x*x" --test2 How,are,you --test0 how --test4 z   ; # [successful, 'test2' has 1 element of value 'How,are,you']
npm test --- --order 1 --func "x => x*x" --test0 how --test1 t u --test4 z           ; # Error: Argument 'test1' already specified
npm test --- --order 1 --func "x => x*x" --test0 how --test1 t,u --test4 z           ; # [successful]
npm test --- --order 1 --func "x => x*x" --test0 how --test1 v --test4 z             ; # [successful, 'test1' has 1 element]
npm test --- --order 1 --func "x => x*x" --test0 how --test4 x y z                   ; # [successful, 'test4' has 3 elements]
npm test --- --order 1 --func "x => x*x" --test0 how --test4 x,y,z                   ; # [successful, 'test4' has 1 element of value 'x,y,z']
npm test --- --test4 z --order 1 --func "x => x*x" --test4 y --test0 how --test4 x   ; # [successful, 'test4' has 3 elements]
npm test --- --order 1 --func "x => x*x" --test0 how --test4 x --test3 7 8 9         ; # [successful, 'test3' has 3 elements]
*/
