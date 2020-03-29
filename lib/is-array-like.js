const getLength = require('./get-length');

const MAX_ARRAY_INDEX = 2 ** 53 - 1;

module.exports = (collection) => {
	const length = getLength(collection);

	return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
};
