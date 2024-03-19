
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

export const padl = (val, len, pad) => {
	if (!pad || ('' + pad).length <= 0) pad = ' ';
	if (!len || len <= 0 || ('' + val).length >= len) return val;
	return (pad.repeat(len) + val).slice(-1 * len);
};

export const signOf = (val) => (val < 0) ? -1 : (val > 0) ? 1 : 0;

const toType = (org, str) => {
	switch (typeof org) {
		case 'number':
			return +str;
		case 'boolean':
			return (str === 'true' || str === 'T');
		case 'object':
			if (Array.isArray(org) && (org.length > 0)) {
				return str.split(',').map(v => toType(org[0], v));
			} else if (typeof org.getMonth === 'function') {
				return Date.parse(str);
			} else {
				return JSON.parse(str);
			}
		default:
			return str;
	}
};

/*
input = {
	[key]: {
		D (default) : -1000,
		R (required): false, // (default is false)
		M (message) : "start of range of x value used",
		E (enum)    : "debug|verbose|silence",
	},
}
*/
const usage = (input, message) => {
	const keys = Object.keys(input);
	let mlen = 0;
	for (const key of keys) {
		if (key.length > mlen) mlen = key.length;
	}
	const pad = ''.padStart(mlen, ' ');

	console.log('Usage: npm start --- [{option} {value}]');
	console.log('options:');
	for (const key of keys) {
		console.log(`  --${(key + pad).substring(0, mlen)}  ${input[key].M} (${input[key].E ? `allowed values: ${input[key].E.split('|')}` : (input[key].R ? 'required' : `default: ${input[key].D}`)})`);
	}
	if (message) console.log(`\nError: ${message}`);
	console.log();
	process.exit(1);
};

export const parseArgs = (input) => {
	const keys = Object.keys(input);
	const config = {};
	for (const key of keys) {
		if (key === "-h" || key === "--help") usage(input);
		config[key] = input[key].R ? null : input[key].D;
	}

	let idx = 2;
	while (idx < process.argv.length) {
		const argv = process.argv[idx];
		const key = (argv.startsWith('--') ? argv.substring(2) : (argv.startsWith('-') ? argv.substring(1) : undefined));
		if (!key || !keys.includes(key)) {
			usage(input);
		}
		config[key] = toType(input[key].D, process.argv[++idx]);
		idx ++;
	}

	for (const obj of Object.entries(config)) {
		if (obj.length != 2) {
			usage(input, `Invalid argument '${obj}'`);
		}
		if (obj[1] === null) {
			usage(input, `Argument '${obj[0]}' required`);
		}
		if (input[obj[0]].E) {
			if (!input[obj[0]].E.split('|').includes(obj[1])) {
				usage(input, `Invalid value '${obj[1]}' of argument '${obj[0]}'`);
			}
		}
	}

	return config;
};
