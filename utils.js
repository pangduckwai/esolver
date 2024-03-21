
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
		D (Default) : -1000,
		R (Required): false, // required field, false if not provided
		U (mUltiple): false, // allow specifying multiple times in the command line, false if not provided, if also a required field, do not add default(D) to the array
		M (Message) : "start of range of x value used",
		E (Enum)    : "debug|verbose|silence",
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
		console.log(`  --${(key + pad).substring(0, mlen)}  ${input[key].M} (${input[key].E ? `values: ${input[key].E.split('|')}` : (input[key].R ? 'required' : `default: ${input[key].D}`)})`);
	}
	if (message) console.log(`\nError: ${message}`);
	console.log();
	return undefined;
};

export const parseArgs = (input) => {
	const keys = Object.keys(input);
	const config = {};
	for (const key of keys) {
		if (key === "-h" || key === "--help") return usage(input);
		config[key] = input[key].U ? [] : null; // do not add default(D) just yet
	}

	let idx = 2;
	let key;
	while (idx < process.argv.length) {
		const optn = process.argv[idx];
		if (optn.startsWith('--')) {
			idx ++;
			key = optn.substring(2);
		}
		if (!key || !keys.includes(key)) return usage(input);
		if (input[key].U) {
			if (Array.isArray(input[key].D) && input[key].D.length > 0) {
				config[key].push(toType(input[key].D[0], process.argv[idx])); // if default(D) given is an array, use the first element to detect the type
			} else {
				config[key].push(toType(input[key].D, process.argv[idx]));
			}
		} else if (config[key] !== null) {
			return usage(input, `Argument '${key}' already specified`);
		} else {
			config[key] = toType(input[key].D, process.argv[idx]);
		}
		idx ++;
	}

	for (const key of Object.keys(config)) {
		if ((config[key] === null) || (Array.isArray(config[key]) && config[key].length <= 0)) {
			// required argument missing
			if (input[key].R) return usage(input, `Argument '${key}' required`);

			// otherwise use default value
			if (Array.isArray(config[key]) && !Array.isArray(input[key].D)) {
				config[key].push(input[key].D);
			} else {
				config[key] = input[key].D;
			}
		}

		if (input[key].E) {
			if (!input[key].E.split('|').includes(config[key])) {
				return usage(input, `Invalid value '${config[key]}' of argument '${key}'`);
			}
		}
	}

	return config;
};
