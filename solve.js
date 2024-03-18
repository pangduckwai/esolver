
const padl = (val, len, pad) => {
	if (!pad || ('' + pad).length <= 0) pad = ' ';
	if (!len || len <= 0 || ('' + val).length >= len) return val;
	return (pad.repeat(len) + val).slice(-1 * len);
};

export const report = (hdrs, solns) => {
	if (solns.length <= 0) {
		console.log('Solution not found');
		return;
	}

	const col = [];
	for (const hdr of hdrs) {
		col.push(hdr.length);
	}

	const out = [];
	for (const soln of solns.filter(s => s !== null)) {
		const row = [];
		for (const [idx, val] of Object.values(soln).entries()) {
			const str = `${val}`;
			row.push(str);
			const len = str.length;
			if (len > col[idx]) col[idx] = len;
		}
		out.push(row);
	}

	let gl0 = '╒';
	let gl1 = '╞';
	let glx = '├';
	let gln = '╘';
	let buf = '│';
	for (let idx = 0; idx < col.length; idx ++) {
		gl0 += '═'.repeat(col[idx]) + ((idx === col.length - 1) ? '╕' : '╤');
		gl1 += '═'.repeat(col[idx]) + ((idx === col.length - 1) ? '╡' : '╪');
		glx += '─'.repeat(col[idx]) + ((idx === col.length - 1) ? '┤' : '┼');
		gln += '═'.repeat(col[idx]) + ((idx === col.length - 1) ? '╛' : '╧');
		buf += padl(hdrs[idx], col[idx]) + '│';
	}
	console.log(gl0);
	console.log(buf);
	console.log(gl1);

	for (let row = 0; row < out.length; row ++) {
		buf = '│';
		for (let idx = 0; idx < out[row].length; idx ++) {
			buf += padl(out[row][idx], col[idx]) + '│';
		}
		console.log(buf);
		if ((row+1) < out.length) console.log(glx);
	}
	console.log(gln);
};

const signOf = (val) => (val < 0) ? -1 : (val > 0) ? 1 : 0;

export const gradient = (p1, p2) => {
	if (!p1 || (p1.x === undefined) || (p1.y === undefined) || !p2 || (p2.x === undefined) || (p2.y === undefined)) return undefined;
	if (p1.x === p2.x) {
		if (p2.y > p1.y) {
			return Number.MAX_SAFE_INTEGER;
		} else if (p1.y > p2.y) {
			return Number.MIN_SAFE_INTEGER;
		} else {
			return NaN;
		}
	}
	return (p2.y - p1.y) / (p2.x - p1.x);
};

export const _solve = (expected, range, func, verbose) => {
	const solutions = [];
	let retry = 0; // number of retry
	let step = 2.0; // step of each iteration
	let count // number of solution found
	do {
		solutions.splice(0, solutions.length);
		for (let i = 0; i < expected; i ++) {
			solutions.push(null);
		}

		count = 0;
		step /= 2;
		retry ++;
		let sign0; // sign of the 0th derivative (the value) of the previous run
		let sign1; // sign of the 1st derivative of the previous run
		let x0, y0; // the point of the previous run
		let idx = 0; // index of the # of the 1st derivative change sign
		for (let x = range.fm; x <= range.to; x += step) {
			const y = func(x);
			const s0 = signOf(y); // sign of the current value
			const s1 = ((x0 !== undefined) && (y0 !== undefined)) ? signOf(gradient({x: x0, y: y0}, { x, y })) : undefined; // sign of the current gradient

			if ((sign1 !== undefined) && (s1 !== undefined) && ((s1 !== 0) && (sign1 !== s1))) idx ++; // slope sign changed, proceed to next stage (not counting slope change to zero)

			if ((sign0 !== undefined) && (sign0 !== s0)) { // value sign changed, solution found
				if (solutions[idx] === null) count ++; // should be faster than filtering 'solutions' in each iteration
				const ay0 = Math.abs(y0);
				const ay1 = Math.abs(y);
				if (ay0 === ay1)
					solutions[idx] = { x: (x0 + x)/2, y: 0 };
				else if (ay0 < ay1 )
					solutions[idx] = { x: x0, y: y0 };
				else
					solutions[idx] = { x, y };
				if (count >= expected) break; // found all solutions, do not need to continue
			}

			x0 = x;
			y0 = y;
			sign0 = s0;
			if (s1 !== 0) sign1 = s1;
		}
		if (verbose < 0 && count < expected) console.log(` - retry (${retry}/${step}): ${JSON.stringify(solutions, null, 2)}`);
	} while (count < expected && retry < 5);

	if (verbose < 0) {
		if (count >= expected)
			console.log(` - solutions (${step}): ${JSON.stringify(solutions, null, 2)}`);
		else
			console.log(` - expecting (${expected}/${step}) solutions, got: ${JSON.stringify(solutions, null, 2)}`);
	}

	return {
		expected,
		retry,
		step,
		count,
		solutions,
	}
};

export const solve = (
	order, // order of the equation to be solved
	range, // range of x values to use when solving the equation
	func, // function representing the equation to be solved
	header, // head to display
	verbose, // -1 - debug; 0/null - verbose; 1 - silence
) => {
	// Check arguments
	if (!verbose || isNaN(verbose)) {
		verbose = 0;
	}

	if (!header || !Array.isArray(header) || (header.length < 2) || (typeof header[0] !== 'string') || (typeof header[1] !== 'string')) {
		header = ['X', 'Y'];
	} else if (header.length > 2) {
		header.splice(2, header.length - 2);
	}

	if ((order === undefined) || isNaN(order)) {
		const msg = `Invalid order of equation specified: ${JSON.stringify(order)}`;
		if (verbose <= 0) console.log(msg);
		return { code: -4, msg };
	}

	if (!range || (range.to === undefined) ||
			(range.fm === undefined && range.from === undefined) || (range.fm !== undefined && range.from !== undefined) || // may either provide 'fm' or 'from' but not both
			(range.fm !== undefined && isNaN(range.fm)) || (range.from !== undefined && isNaN(range.from)) || (range.to !== undefined && isNaN(range.to))) { // values provided must be numeric
		const msg = `Invalid range specified: ${!!range ? JSON.stringify(range, null, 2) : 'undefined'}`;
		if (verbose <= 0) console.log(msg);
		return { code: -3, msg };
	} else if (range.from !== undefined) {
		range.fm = range.from;
		delete range.from;
	}

	if (!func || (func.length !== 1) || isNaN(func(0))) {
		const msg = `Invalid equation representing function specified: ${!!func ? func.toString() : 'undefined'}`;
		if (verbose <= 0) console.log(msg);
		return { code: -2, msg };
	}

	// Solve
	if (verbose <= 0) console.log(`Solving\n\t${func.toString()}\nwith range of x from ${(range.from || range.fm)} to ${range.to}:`);
	const solved = _solve(order, range, func, verbose);
	if (!solved || !solved.expected || !solved.solutions || !Array.isArray(solved.solutions)) {
		const msg = `Error: running equation solver failed: ${!!solved ? JSON.stringify(solved, null, 2) : 'undefined'}`;
		if (verbose <= 0) console.log(msg);
		return { code: -1, msg };
	}

	// Respond
	if (verbose <= 0) {
		if (verbose < 0 || (solved.expected !== solved.count)) {
			console.log(`Expecting ${solved.expected} solution(s), found ${solved.count}. Retried ${solved.retry} time(s) with step ${solved.step}`);
		}
		report(header, solved.solutions);
	}

	return {
		code: 0,
		...solved
	};
};
