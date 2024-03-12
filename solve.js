
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
	col.push(1);
	hdrs.push(' ');

	const out = [];
	for (const soln of solns) {
		for (const rst of soln.rst) {
			const row = [];
			for (let idx = 0; idx < rst.length; idx ++) {
				const str = `${rst[idx]}`;
				row.push(str);

				const len = str.length;
				if (len > col[idx]) col[idx] = len;
			}
			if (rst.length > 0 && rst[0] === soln.x)
				row.push('*');
			else
				row.push(' ');
			out.push(row);
		}
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

export const _solve = (order, range, func, verbose) => {
	let sign, stage = 0;
	const vals = [];
	for (let i = 0; i < order; i ++) {
		vals.push([]);
	}
	for (let x = (range.from || range.fm); (x <= range.to) && (stage < order); x ++) {
		const y = func(x);
		const s = (y < 0) ? -1 : (y > 0) ? 1 : 0;

		vals[stage].push({ x, y });
		if (vals[stage].length > 2) vals[stage].shift();

		if (!!sign && (sign !== s)) stage ++;
		sign = s;
	}
	if (verbose < 0) console.log('1', JSON.stringify(vals, null, 2));

	if (stage < order) {
		vals.splice(stage, order - stage);
	}

	const soln = [];
	for (let i = 0; i < vals.length; i ++) {
		soln.push(null);
	}
	for (let i = 0; i < vals.length; i ++) {
		for (const val of vals[i]) {
			if (!soln[i] || Math.abs(val.y) < Math.abs(soln[i].y)) {
				soln[i] = val;
			}
		}
	}
	if (verbose < 0) console.log('2', JSON.stringify(soln, null, 2));

	return {
		expected: order,
		solutions: soln.map((s, i) => ({...s, rst: vals[i].reduce((a, c) => {
				a.push(Object.values(c));
				return a;
			}, [])
		})),
	}
};

export const solve = (
	order,
	range,
	func,
	header,
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

	if (!order || isNaN(order)) {
		const msg = `Invalid order of equation specified: ${JSON.stringify(order)}`;
		if (verbose <= 0) console.log(msg);
		return { code: -4, msg };
	}

	if (!range || (!range.fm && !range.from) || (range.fm && range.from) || !range.to || (!!range.fm && isNaN(range.fm)) || (!!range.from && isNaN(range.from)) || (!!range.to && isNaN(range.to))) {
		const msg = `Invalid range specified: ${!!range ? JSON.stringify(range, null, 2) : 'undefined'}`;
		if (verbose <= 0) console.log(msg);
		return { code: -3, msg };
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

	if (verbose < 0) console.log('3', JSON.stringify(solved, null, 2));

	if (verbose <= 0) report(header, solved.solutions);
	return {
		code: 0,
		...solved
	};
};