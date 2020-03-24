const map = require('map-plus');
const forEach = require('for-each-plus');

const shallowProperty = key => obj => obj == null ? void 0 : obj[key];

const MAX_ARRAY_INDEX = 2 ** 53 - 1;

const getLength = shallowProperty('length');

const isArrayLike = (collection) => {
	const length = getLength(collection);

	return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
};

const isFunction = obj => toString.call(obj) === '[object Function]';

const isNumber = obj => toString.call(obj) === '[object Number]';

const isArguments = obj => toString.call(obj) === '[object Arguments]';

const isString = obj => toString.call(obj) === '[object String]';

const isObject = obj => {
	const type = typeof obj;

	return type === 'function' || type === 'object' && !!obj;
};

const getKeys = (obj) => {
	if (!isObject(obj)) return [];

	return Object.keys(obj);
};

const isMatch = (object, attrs) => {
	const keys = getKeys(attrs);
	const {length} = keys;

	if (object == null) return !length;
	const obj = Object(object);

	for (let i = 0; i < length; i++) {
		const key = keys[i];

		if (attrs[key] !== obj[key] || !(key in obj)) return false;
	}

	return true;
};

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

const identity = value => value;

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

const optimizeCb = (func, context, argCount) => {
	if (context === void 0) return func;
	switch (argCount == null ? 3 : argCount) {
		case 1: return value => func.call(context, value);
			// The 2-argument case is omitted because we’re not using it.
		case 3: return (value, index, collection) => func.call(context, value, index, collection);
		case 4: return (accumulator, value, index, collection) => func.call(context, accumulator, value, index, collection);
	}

	return (...args) => func.apply(context, args);
};

const matcher = attrs => {
	attrs = Object.assign({}, attrs);

	return obj => isMatch(obj, attrs);
};

const deepGet = (obj, path) => {
	const { length } = path;

	for (let i = 0; i < length; i++) {
		if (obj == null) return void 0;
		obj = obj[path[i]];
	}

	return length ? obj : void 0;
};

const property = path => {
	if (!Array.isArray(path)) {
		return shallowProperty(path);
	}

	return obj => deepGet(obj, path);
};

const baseIteratee = (value, context, argCount) => {
	if (value == null) return identity;
	if (isFunction(value)) return optimizeCb(value, context, argCount);
	if (isObject(value) && !Array.isArray(value)) return matcher(value);

	return property(value);
};

let iteratee;

const exportIteratee = iteratee = (value, context) => baseIteratee(value, context, Infinity);

const cb = (value, context, argCount) => {
	if (iteratee !== exportIteratee) return iteratee(value, context);

	return baseIteratee(value, context, argCount);
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
	isFunction,
	isNumber,
	isArguments,
	isString,
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
	find,
	filter,
	toArray,
	first,
	initial,
	findIndex
};
