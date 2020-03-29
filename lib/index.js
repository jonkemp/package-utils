const shallowProperty = require('./shallow-property');

const getLength = require('./get-length');

const isArrayLike = require('./is-array-like');

const isFunction = require('./is-function');

const isObject = require('./is-object');

const isArguments = require('./is-arguments');

const identity = require('./identity');

const getKeys = require('./get-keys');

const property = require('./property');

const matcher = require('./matcher');

const isMatch = require('./is-match');

const optimizeCb = require('./optimize-cb');

const cb = require('./cb');

module.exports = {
	shallowProperty,
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
};
