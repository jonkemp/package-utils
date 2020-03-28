const {
	getLength,
	isArrayLike,
	isFunction,
	isObject,
	isArguments,
	identity,
	getKeys,
	property,
	matcher,
	isMatch,
	optimizeCb,
	cb
} = require('./lib');
const forEach = require('./lib/for-each');
const flatten = require('./lib/flatten');
const map = require('./lib/map');

const isNumber = obj => toString.call(obj) === '[object Number]';

const isString = obj => toString.call(obj) === '[object String]';

const isUndefined = obj => obj === void 0;

const has = (obj, path) => obj != null && Object.prototype.hasOwnProperty.call(obj, path);

const hasProperty = (obj, path) => {
	if (!Array.isArray(path)) {
		return has(obj, path);
	}
	const { length } = path;

	for (let i = 0; i < length; i++) {
		const key = path[i];

		if (obj == null || !Object.prototype.hasOwnProperty.call(obj, key)) {
			return false;
		}
		obj = obj[key];
	}

	return !!length;
};

const constant = value => () => value;

const keyInObj = (value, key, obj) => key in obj;

const allKeys = obj => {
	if (!isObject(obj)) return [];
	const keys = [];

	for (const key in obj) keys.push(key);

	return keys;
};

const values = (obj) => {
	const keys = getKeys(obj);
	const { length } = keys;
	const values = Array(length);

	for (let i = 0; i < length; i++) {
		values[i] = obj[keys[i]];
	}

	return values;
};

const toPairs = (obj) => {
	const keys = getKeys(obj);
	const pairs = [];

	for (const key of keys) {
		pairs.push([key, obj[key]]);
	}

	return pairs;
};

const noop = () => {};

const initial = (array, n, guard) => Array.prototype.slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));

const createPredicateIndexFinder = dir => (array, predicate, context) => {
	predicate = cb(predicate, context);
	const length = getLength(array);
	let index = dir > 0 ? 0 : length - 1;

	for (; index >= 0 && index < length; index += dir) {
		if (predicate(array[index], index, array)) return index;
	}

	return -1;
};

const findIndex = createPredicateIndexFinder(1);

const range = (start, stop, step) => {
	if (stop == null) {
		stop = start || 0;
		start = 0;
	}
	if (!step) {
		step = stop < start ? -1 : 1;
	}

	const length = Math.max(Math.ceil((stop - start) / step), 0);
	const range = Array(length);

	for (let idx = 0; idx < length; idx++, start += step) {
		range[idx] = start;
	}

	return range;
};

const findKey = (obj, predicate, context) => {
	predicate = cb(predicate, context);
	const keys = getKeys(obj);
	let key;

	for (let i = 0, { length } = keys; i < length; i++) {
		key = keys[i];
		if (predicate(obj[key], key, obj)) return key;
	}
};

const find = (obj, predicate, context) => {
	const keyFinder = isArrayLike(obj) ? findIndex : findKey;
	const key = keyFinder(obj, predicate, context);

	if (key !== void 0 && key !== -1) return obj[key];
};

const filter = (obj, predicate, context) => {
	const results = [];

	predicate = cb(predicate, context);
	forEach(obj, (value, index, list) => {
		if (predicate(value, index, list)) results.push(value);
	});

	return results;
};

const reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;

const toArray = (obj) => {
	if (!obj) return [];
	if (Array.isArray(obj)) return Array.prototype.slice.call(obj);
	if (isString(obj)) {
		// Keep surrogate pair characters together
		return obj.match(reStrSymbol);
	}
	if (isArrayLike(obj)) return map(identity);

	return values(obj);
};

const first = (array, n, guard) => {
	if (array == null || array.length < 1) return n == null ? void 0 : [];
	if (n == null || guard) return array[0];

	return initial(array, array.length - n);
};

module.exports = {
	getLength,
	isArrayLike,
	optimizeCb,
	isFunction,
	isNumber,
	isArguments,
	isString,
	isUndefined,
	isObject,
	getKeys,
	hasProperty,
	property,
	isMatch,
	matcher,
	findKey,
	identity,
	constant,
	keyInObj,
	allKeys,
	values,
	toPairs,
	cb,
	noop,
	forEach,
	map,
	find,
	filter,
	toArray,
	first,
	initial,
	flatten,
	findIndex,
	range
};
