const noop = () => {};

const getLength = require('../lib/get-length');

const isArrayLike = require('../lib/is-array-like');

const getKeys = require('../lib/get-keys');

const forEach = require('../lib/for-each');

const cb = require('../lib/cb');

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

const initial = (array, n, guard) => Array.prototype.slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));

const first = (array, n, guard) => {
	if (array == null || array.length < 1) return n == null ? void 0 : [];
	if (n == null || guard) return array[0];

	return initial(array, array.length - n);
};

module.exports = {
	noop,
	find,
	filter,
	range,
	first
};
