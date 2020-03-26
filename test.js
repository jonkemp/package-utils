const assert = require('assert');
const {
	identity,
	constant,
	noop,
	getKeys,
	allKeys,
	values,
	toPairs,
	isObject,
	isArguments,
	isFunction,
	isString,
	isNumber,
	isUndefined,
	hasProperty,
	property,
	isMatch,
	matcher,
	findKey,
	first,
	initial,
	flatten,
	findIndex,
	range,
	forEach,
	map,
	find,
	filter,
	toArray
} = require('./');

describe('identity', () => {
	it('stooge is the same as his identity', () => {
		const stooge = {name: 'moe'};

		assert.strictEqual(identity(stooge), stooge);
	});
});

describe('constant', () => {
	it('should create a function that returns stooge', () => {
		const stooge = {name: 'moe'};

		assert.strictEqual(constant(stooge)(), stooge);
	});
});

describe('noop', () => {
	it('should always return undefined', () => {
		assert.strictEqual(noop('curly', 'larry', 'moe'), void 0);
	});
});

describe('getKeys', () => {
	it('can extract the keys from an object', () => {
		assert.deepEqual(getKeys({one: 1, two: 2}), ['one', 'two']);
	});

	it('is not fooled by sparse arrays', () => {
		const a = [];

		a[1] = 0;

		assert.deepEqual(getKeys(a), ['1']);
		assert.deepEqual(getKeys(null), []);
		assert.deepEqual(getKeys(void 0), []);
		assert.deepEqual(getKeys(1), []);
		assert.deepEqual(getKeys('a'), []);
		assert.deepEqual(getKeys(true), []);
	});

	it('matches non-enumerable properties', () => {
		const trouble = {
			constructor: Object,
			valueOf: noop,
			hasOwnProperty: null,
			toString: 5,
			toLocaleString: void 0,
			propertyIsEnumerable: /a/,
			isPrototypeOf: this,
			__defineGetter__: Boolean,
			__defineSetter__: {},
			__lookupSetter__: false,
			__lookupGetter__: []
		};
		const troubleKeys = ['constructor', 'valueOf', 'hasOwnProperty', 'toString', 'toLocaleString', 'propertyIsEnumerable',
			'isPrototypeOf', '__defineGetter__', '__defineSetter__', '__lookupSetter__', '__lookupGetter__'].sort();

		assert.deepEqual(getKeys(trouble).sort(), troubleKeys, 'matches non-enumerable properties');
	});
});

describe('allKeys', () => {
	it('can extract the allKeys from an object', () => {
		assert.deepEqual(allKeys({one: 1, two: 2}), ['one', 'two']);
	});

	it('is not fooled by sparse arrays', () => {
		const a = [];

		a[1] = 0;

		assert.deepEqual(allKeys(a), ['1']);
	});

	it('is not fooled by sparse arrays with additional properties', () => {
		const a = [];

		a[1] = 0;
		a.a = a;
		assert.deepEqual(allKeys(a), ['1', 'a']);
	});

	it('should handle null/undefined', () => {
		[null, void 0, 1, 'a', true, NaN, {}, [], new Number(5), new Date(0)].forEach(val => {
			assert.deepEqual(allKeys(val), []);
		});
	});

	it('matches non-enumerable properties', () => {
		const trouble = {
			constructor: Object,
			valueOf: noop,
			hasOwnProperty: null,
			toString: 5,
			toLocaleString: void 0,
			propertyIsEnumerable: /a/,
			isPrototypeOf: this
		};
		const troubleKeys = ['constructor', 'valueOf', 'hasOwnProperty', 'toString', 'toLocaleString', 'propertyIsEnumerable',
			'isPrototypeOf'].sort();

		assert.deepEqual(allKeys(trouble).sort(), troubleKeys);
	});

	it('should include inherited keys', () => {
		function A() {}
		A.prototype.foo = 'foo';
		const b = new A();

		b.bar = 'bar';
		assert.deepEqual(allKeys(b).sort(), ['bar', 'foo']);
	});

	it('should get keys from constructor', () => {
		function y() {}
		y.x = 'z';
		assert.deepEqual(allKeys(y), ['x']);
	});
});

describe('values', () => {
	it('can extract the values from an object', () => {
		assert.deepEqual(values({one: 1, two: 2}), [1, 2]);
	});

	it('can extract the values from an object even when one of them is "length"', () => {
		assert.deepEqual(values({one: 1, two: 2, length: 3}), [1, 2, 3]);
	});
});

describe('toPairs', () => {
	it('can convert an object into pairs', () => {
		assert.deepEqual(toPairs({one: 1, two: 2}), [['one', 1], ['two', 2]]);
	});

	it('can convert an object into pairs even when one of them is "length"', () => {
		assert.deepEqual(toPairs({one: 1, two: 2, length: 3}), [['one', 1], ['two', 2], ['length', 3]]);
	});
});

describe('isArguments', () => {
	it('a string is not an arguments object', () => {
		assert.ok(!isArguments('string'));
	});

	it('a function is not an arguments object', () => {
		assert.ok(!isArguments(isArguments));
	});

	it('the arguments object is an arguments object', () => {
		const args = (function(){ return arguments; }(1, 2, 3));

		assert.ok(isArguments(args));
	});

	it('should always return undefined', () => {
		const args = (function(){ return arguments; }(1, 2, 3));

		assert.ok(!isArguments(toArray(args)), 'but not when it\'s converted into an array');
	});

	it('vanilla arrays are not an arguments object', () => {
		assert.ok(!isArguments([1, 2, 3]));
	});
});

describe('isObject', () => {
	it('the arguments object is object', () => {
		assert.ok(isObject(arguments));	// eslint-disable-line
	});

	it('array is object', () => {
		assert.ok(isObject([1, 2, 3]));
	});

	it('DOM element is object', () => {
		const testElement = typeof document === 'object' ? document.createElement('div') : void 0;

		if (testElement) {
			assert.ok(isObject(testElement));
		}
	});

	it('function is object', () => {
		assert.ok(isObject(function() {}));	// eslint-disable-line
	});

	it('null is not object', () => {
		assert.ok(!isObject(null));
	});

	it('undefined is not object', () => {
		assert.ok(!isObject(void 0));
	});

	it('string is not object', () => {
		assert.ok(!isObject('string'));
	});

	it('number is not object', () => {
		assert.ok(!isObject(12));
	});

	it('boolean is not object', () => {
		assert.ok(!isObject(true));
	});

	it('new String() is object', () => {
		assert.ok(isObject(new String('string')));
	});
});

describe('isString', () => {
	it('element is not a string', () => {
		const testElement = typeof document === 'object' ? document.createElement('div') : void 0;

		if (testElement) {
			assert.ok(!isString(testElement));
		}
	});

	it('string is a string', () => {
		assert.ok(isString([1, 2, 3].join(', ')));
	});

	it('string literal is a string', () => {
		assert.strictEqual(isString('I am a string literal'), true);
	});

	it('string object is a string', () => {
		const obj = new String('I am a string object');

		assert.ok(isString(obj), 'so are String objects');
	});

	it('number is not a string', () => {
		assert.strictEqual(isString(1), false);
	});
});

describe('isNumber', () => {
	it('a string is not a number', () => {
		assert.ok(!isNumber('string'));
	});

	it('the arguments object is not a number', () => {
		assert.ok(!isNumber(arguments));	// eslint-disable-line
	});

	it('undefined is not a number', () => {
		assert.ok(!isNumber(void 0));
	});

	it('a number is a number', () => {
		assert.ok(isNumber(3 * 4 - 7 / 10));
	});

	it('NaN *is* a number', () => {
		assert.ok(isNumber(NaN));
	});

	it('Infinity is a number', () => {
		assert.ok(isNumber(Infinity));
	});

	it('numeric strings are not numbers', () => {
		assert.ok(!isNumber('1'));
	});
});

describe('isUndefined', () => {
	it('numbers are defined', () => {
		assert.ok(!isUndefined(1));
	});

	it('null is defined', () => {
		assert.ok(!isUndefined(null));
	});

	it('false is defined', () => {
		assert.ok(!isUndefined(false));
	});

	it('NaN is defined', () => {
		assert.ok(!isUndefined(NaN));
	});

	it('nothing is undefined', () => {
		assert.ok(isUndefined());
	});

	it('undefined is undefined', () => {
		assert.ok(isUndefined(void 0));
	});
});

describe('isFunction', () => {
	it('undefined vars are not functions', () => {
		assert.ok(!isFunction(void 0));
	});

	it('arrays are not functions', () => {
		assert.ok(!isFunction([1, 2, 3]));
	});

	it('strings are not functions', () => {
		assert.ok(!isFunction('moe'));
	});

	it('functions are functions', () => {
		assert.ok(isFunction(isFunction));
	});

	it('anonymous functions are functions', () => {
		assert.ok(isFunction(function(){}));	// eslint-disable-line
	});

	it('elements are not functions', () => {
		const testElement = typeof document === 'object' ? document.createElement('div') : void 0;

		if (testElement) {
			assert.ok(!isFunction(testElement));
		}

		const nodelist = typeof document != 'undefined' && document.childNodes;

		if (nodelist) {
			assert.ok(!isFunction(nodelist));
		}
	});
});

describe('hasProperty', () => {
	it('checks that the object has a property', () => {
		const obj = {foo: 'bar', func: function(){}};

		assert.ok(hasProperty(obj, 'foo'));
	});

	it('returns false if the object doesn\'t have the property', () => {
		const obj = {foo: 'bar', func: function(){}};

		assert.ok(!hasProperty(obj, 'baz'));
	});

	it('checks that the object has a property that is a function', () => {
		const obj = {foo: 'bar', func: function(){}};

		assert.ok(hasProperty(obj, 'func'));
	});

	it('works when the hasOwnProperty method is deleted', () => {
		const obj = {foo: 'bar', func: function(){}};

		obj.hasOwnProperty = null;
		assert.ok(hasProperty(obj, 'foo'));
	});

	it('does not check the prototype chain for a property', () => {
		const obj = {foo: 'bar', func: function(){}};

		function Child() {}
		Child.prototype = obj;
		const child = new Child();

		assert.ok(!hasProperty(child, 'foo'));
	});

	it('returns false for null', () => {
		assert.strictEqual(hasProperty(null, 'foo'), false);
	});

	it('returns false for undefined', () => {
		assert.strictEqual(hasProperty(void 0, 'foo'), false);
	});

	it('can check for nested properties', () => {
		assert.ok(hasProperty({a: {b: 'foo'}}, ['a', 'b']));
	});

	it('does not check the prototype of nested props', () => {
		const obj = {foo: 'bar', func: function(){}};

		function Child() {}
		Child.prototype = obj;
		const child = new Child();

		assert.ok(!hasProperty({a: child}, ['a', 'foo']));
	});
});

describe('property', () => {
	it('should return the property with the given name', () => {
		const stooge = {name: 'moe'};

		assert.strictEqual(property('name')(stooge), 'moe');
	});

	it('should return undefined for null values', () => {
		assert.strictEqual(property('name')(null), void 0);
	});

	it('should return undefined for undefined values', () => {
		assert.strictEqual(property('name')(void 0), void 0);
	});

	it('should return undefined for null object', () => {
		assert.strictEqual(property(null)('foo'), void 0);
	});

	it('can fetch null values', () => {
		assert.strictEqual(property('x')({x: null}), null);
	});

	it('does not crash on property access of non-objects', () => {
		assert.strictEqual(property('length')(null), void 0);
	});

	it('can get a direct property', () => {
		assert.strictEqual(property('a')({a: 1}), 1);
	});

	it('can get a nested property', () => {
		assert.strictEqual(property(['a', 'b'])({a: {b: 2}}), 2);
	});

	it('can fetch falsy values', () => {
		assert.strictEqual(property(['a'])({a: false}), false);
	});

	it('can fetch null values deeply', () => {
		assert.strictEqual(property(['x', 'y'])({x: {y: null}}), null);
	});

	it('does not crash on property access of nested non-objects', () => {
		assert.strictEqual(property(['x', 'y'])({x: null}), void 0);
	});

	it('returns `undefined` for a path that is an empty array', () => {
		assert.strictEqual(property([])({x: 'y'}), void 0);
	});
});

describe('isMatch', () => {
	it('Returns a boolean', () => {
		const moe = {name: 'Moe Howard', hair: true};
		const curly = {name: 'Curly Howard', hair: false};

		assert.strictEqual(isMatch(moe, {hair: true}), true);
		assert.strictEqual(isMatch(curly, {hair: true}), false);
	});

	it('can match undefined props on primitives', () => {
		assert.strictEqual(isMatch(5, {__x__: void 0}), false);
	});

	it('can match undefined props', () => {
		assert.strictEqual(isMatch({__x__: void 0}, {__x__: void 0}), true);
	});

	it('Empty spec called with null object returns true', () => {
		assert.strictEqual(isMatch(null, {}), true);
	});

	it('Non-empty spec called with null object returns false', () => {
		assert.strictEqual(isMatch(null, {a: 1}), false);
	});

	it('null matches null', () => {
		[null, void 0].forEach(item => assert.strictEqual(isMatch(item, null), true));
	});

	it('null matches {}', () => {
		[null, void 0].forEach(item => assert.strictEqual(isMatch(item, null), true));
	});

	it('handles undefined values', () => {
		assert.strictEqual(isMatch({b: 1}, {a: void 0}), false);
	});

	it('treats primitives as empty', () => {
		[true, 5, NaN, null, void 0].forEach(item => {
			assert.strictEqual(isMatch({a: 1}, item), true);
		});
	});

	it('spec is restricted to own properties', () => {
		function Prototest() {}
		Prototest.prototype.x = 1;
		const specObj = new Prototest;

		assert.strictEqual(isMatch({x: 2}, specObj), true);
	});

	it('inherited and own properties are checked on the test object', () => {
		function Prototest() {}
		Prototest.prototype.x = 1;
		const specObj = new Prototest;

		specObj.y = 5;
		assert.strictEqual(isMatch({x: 1, y: 5}, specObj), true);
		assert.strictEqual(isMatch({x: 1, y: 4}, specObj), false);

		assert.ok(isMatch(specObj, {x: 1, y: 5}));
	});

	it('spec can be a function', () => {
		function Prototest() {}
		Prototest.prototype.x = 1;

		Prototest.x = 5;
		assert.ok(isMatch({x: 5, y: 1}, Prototest));
	});
});

describe('matcher', () => {
	const moe = {name: 'Moe Howard', hair: true};
	const curly = {name: 'Curly Howard', hair: false};
	const stooges = [moe, curly];

	it('Returns a boolean', () => {
		assert.strictEqual(matcher({hair: true})(moe), true);
		assert.strictEqual(matcher({hair: true})(curly), false);
	});

	it('can match undefined props on primitives', () => {
		assert.strictEqual(matcher({__x__: void 0})(5), false);
	});

	it('can match undefined props', () => {
		assert.strictEqual(matcher({__x__: void 0})({__x__: void 0}), true);
	});

	it('Empty spec called with null object returns true', () => {
		assert.strictEqual(matcher({})(null), true);
	});

	it('Non-empty spec called with null object returns false', () => {
		assert.strictEqual(matcher({a: 1})(null), false);
	});

	it('returns a predicate that can be used by finding functions', () => {
		assert.strictEqual(find(stooges, matcher({hair: false})), curly);
	});

	it('can be used to locate an object exists in a collection', () => {
		assert.strictEqual(find(stooges, matcher(moe)), moe);
	});

	it('Do not throw on null values', () => {
		assert.deepEqual(filter([null, void 0], matcher({a: 1})), []);
	});

	it('null matches null', () => {
		assert.deepEqual(filter([null, void 0], matcher(null)), [null, void 0]);
	});

	it('null matches {}', () => {
		assert.deepEqual(filter([null, void 0], matcher({})), [null, void 0]);
	});

	it('handles undefined values', () => {
		assert.deepEqual(filter([{b: 1}], matcher({a: void 0})), []);
	});

	it('treats primitives as empty', () => {
		[true, 5, NaN, null, void 0].forEach(item => {
			assert.strictEqual(matcher(item)({a: 1}), true);
		});
	});

	it('spec is restricted to own properties', () => {
		function Prototest() {}
		Prototest.prototype.x = 1;
		const specObj = new Prototest;
		const protospec = matcher(specObj);

		assert.strictEqual(protospec({x: 2}), true);
	});

	it('inherited and own properties are checked on the test object', () => {
		function Prototest() {}
		Prototest.prototype.x = 1;
		const specObj = new Prototest;
		let protospec = matcher(specObj);

		specObj.y = 5;
		protospec = matcher(specObj);
		assert.strictEqual(protospec({x: 1, y: 5}), true);
		assert.strictEqual(protospec({x: 1, y: 4}), false);

		assert.ok(matcher({x: 1, y: 5})(specObj));
	});

	it('spec can be a function', () => {
		function Prototest() {}
		Prototest.prototype.x = 1;
		Prototest.x = 5;
		assert.ok(matcher(Prototest)({x: 5, y: 1}));
	});

	it('changing spec object doesnt change matches result', () => {
		const o = {b: 1};
		const m = matcher(o);

		assert.strictEqual(m({b: 1}), true);
		o.b = 2;
		o.a = 1;
		assert.strictEqual(m({b: 1}), true);
	});

	it('doesnt falsy match constructor on undefined/null', () => {
		const oCon = matcher({constructor: Object});

		assert.deepEqual(map([null, void 0, 5, {}], oCon), [false, false, false, true]);
	});
});

describe('findKey', () => {
	const objects = {
		a: {a: 0, b: 0},
		b: {a: 1, b: 1},
		c: {a: 2, b: 2}
	};

	it('returns the key where the predicate truth test passes', () => {
		assert.strictEqual(findKey(objects, ({a}) => a === 0), 'a');
		assert.strictEqual(findKey(objects, ({b, a}) => b * a === 4), 'c');
	});

	it('Uses lookupIterator', () => {
		assert.strictEqual(findKey(objects, 'a'), 'b');
	});

	it('Returns undefined where the predicate truth test fails', () => {
		assert.strictEqual(findKey(objects, ({b, a}) => b * a === 5), void 0);
		assert.strictEqual(findKey(objects, ({foo}) => foo === null), void 0);
	});

	it('keys are strings', () => {
		assert.strictEqual(findKey([1, 2, 3, 4, 5, 6], obj => obj === 3), '2');
	});

	it('called with context', () => {
		findKey({a: {a: 1}}, function(a, key, obj) {
			assert.strictEqual(key, 'a');
			assert.deepEqual(obj, {a: {a: 1}});
			assert.strictEqual(this, objects);
		}, objects);
	});

	it('matches array-like keys', () => {
		const array = [1, 2, 3, 4];

		array.match = 55;
		assert.strictEqual(findKey(array, x => x === 55), 'match');
	});
});

describe('first', () => {
	it('can pull out the first element of an array', () => {
		assert.strictEqual(first([1, 2, 3]), 1);
	});

	it('returns an empty array when n <= 0 (0 case)', () => {
		assert.deepEqual(first([1, 2, 3], 0), []);
	});

	it('returns an empty array when n <= 0 (negative case)', () => {
		assert.deepEqual(first([1, 2, 3], -1), []);
	});

	it('can fetch the first n elements', () => {
		assert.deepEqual(first([1, 2, 3], 2), [1, 2]);
	});

	it('returns the whole array if n > length', () => {
		assert.deepEqual(first([1, 2, 3], 5), [1, 2, 3]);
	});

	it('works on an arguments object', () => {
		const result = (function(){ return first(arguments); }(4, 3, 2, 1));

		assert.strictEqual(result, 4);
	});

	it('works well with map', () => {
		const result = map([[1, 2, 3], [1, 2, 3]], first);

		assert.deepEqual(result, [1, 1]);
	});

	it('returns undefined when called on null', () => {
		assert.strictEqual(first(null), void 0);
	});

	it('returns an empty array when called with an explicit number of elements to return', () => {
		assert.deepEqual(first([], 10), []);
		assert.deepEqual(first([], 1), []);
		assert.deepEqual(first(null, 5), []);
	});

	it('return undefined when called on a empty array', () => {
		Array.prototype[0] = 'boo';
		assert.strictEqual(first([]), void 0);
		delete Array.prototype[0];
	});
});

describe('initial', () => {
	it('returns all but the last element', () => {
		assert.deepEqual(initial([1, 2, 3, 4, 5]), [1, 2, 3, 4]);
	});

	it('returns all but the last n elements', () => {
		assert.deepEqual(initial([1, 2, 3, 4], 2), [1, 2]);
	});

	it('returns an empty array when n > length', () => {
		assert.deepEqual(initial([1, 2, 3, 4], 6), []);
	});

	it('works on an arguments object', () => {
		const result = (function(){ return initial(arguments); }(1, 2, 3, 4));

		assert.deepEqual(result, [1, 2, 3]);
	});

	it('works well with map', () => {
		const result = map([[1, 2, 3], [1, 2, 3]], initial);

		assert.deepEqual(flatten(result), [1, 2, 1, 2]);
	});
});

describe('flatten', () => {
	it('supports null', () => {
		assert.deepEqual(flatten(null), []);
	});

	it('supports undefined', () => {
		assert.deepEqual(flatten(void 0), []);
	});

	it('supports empty arrays', () => {
		assert.deepEqual(flatten([[], [[]], []]), []);
	});

	it('can shallowly flatten empty arrays', () => {
		assert.deepEqual(flatten([[], [[]], []], true), [[]]);
	});

	it('can flatten nested arrays', () => {
		const list = [1, [2], [3, [[[4]]]]];

		assert.deepEqual(flatten(list), [1, 2, 3, 4]);
	});

	it('can shallowly flatten nested arrays', () => {
		const list = [1, [2], [3, [[[4]]]]];

		assert.deepEqual(flatten(list, true), [1, 2, 3, [[[4]]]]);
	});

	it('works on an arguments object', () => {
		const result = (function(...args) { return flatten(args); }(1, [2], [3, [[[4]]]]));

		assert.deepEqual(result, [1, 2, 3, 4]);
	});

	it('can shallowly flatten arrays containing only other arrays', () => {
		const list = [[1], [2], [3], [[4]]];

		assert.deepEqual(flatten(list, true), [1, 2, 3, [4]]);
	});

	it('can flatten medium length arrays', () => {
		assert.strictEqual(flatten([range(10), range(10), 5, 1, 3], true).length, 23);
	});

	it('can shallowly flatten medium length arrays', () => {
		assert.strictEqual(flatten([range(10), range(10), 5, 1, 3]).length, 23);
	});

	it('can flatten array with nulls of size n', () => {
		assert.strictEqual(flatten([new Array(10)]).length, 10);
	});

	it('can handle massive arrays', () => {
		assert.strictEqual(flatten([new Array(1000000), range(56000), 5, 1, 3]).length, 1056003);
	});

	it('can handle massive arrays in shallow mode', () => {
		assert.strictEqual(flatten([new Array(1000000), range(56000), 5, 1, 3], true).length, 1056003);
	});

	it('can handle very deep arrays', () => {
		let x = range(100000);

		for (let i = 0; i < 1000; i++) x = [x];
		assert.deepEqual(flatten(x), range(100000));
	});

	it('can handle very deep arrays in shallow mode', () => {
		let x = range(100000);

		for (let i = 0; i < 1000; i++) x = [x];
		assert.deepEqual(flatten(x, true), x[0]);
	});
});

describe('findIndex', () => {
	const objects = [
		{a: 0, b: 0},
		{a: 1, b: 1},
		{a: 2, b: 2},
		{a: 0, b: 0}
	];

	it('returns the first index where the predicate truth test passes', () => {
		assert.strictEqual(findIndex(objects, ({a}) => a === 0), 0);

		assert.strictEqual(findIndex(objects, ({b, a}) => b * a === 4), 2);
	});

	it('Uses lookupIterator', () => {
		assert.strictEqual(findIndex(objects, 'a'), 1);
	});

	it('predicate truth test fails returns -1', () => {
		assert.strictEqual(findIndex(objects, ({b, a}) => b * a === 5), -1);
		assert.strictEqual(findIndex(null, noop), -1);
		assert.strictEqual(findIndex(objects, ({foo}) => foo === null), -1);
	});

	it('called with context', () => {
		findIndex([{a: 1}], function(a, key, obj) {
			assert.strictEqual(key, 0);
			assert.deepEqual(obj, [{a: 1}]);
			assert.strictEqual(this, objects);
		}, objects);
	});

	it('works with sparse arrays', () => {
		const sparse = [];

		sparse[20] = {a: 2, b: 2};
		assert.strictEqual(findIndex(sparse, obj => obj && obj.b * obj.a === 4), 20);
	});

	it('doesn\'t match array-like keys', () => {
		const array = [1, 2, 3, 4];

		array.match = 55;
		assert.strictEqual(findIndex(array, x => x === 55), -1);
	});
});

describe('range', () => {
	it('range with 0 as a first argument generates an empty array', () => {
		assert.deepEqual(range(0), []);
	});

	it('range with a single positive argument generates an array of elements 0,1,2,...,n-1', () => {
		assert.deepEqual(range(4), [0, 1, 2, 3]);
	});

	it('range with two arguments a &amp; b, a&lt;b generates an array of elements a,a+1,a+2,...,b-2,b-1', () => {
		assert.deepEqual(range(5, 8), [5, 6, 7]);
	});

	it('range with three arguments a &amp; b &amp; c, c &lt; b-a, a &lt; b generates an array of elements a,a+c,a+2c,...,b - (multiplier of a) &lt; c', () => {
		assert.deepEqual(range(3, 10, 3), [3, 6, 9]);
	});

	it('range with three arguments a &amp; b &amp; c, c &gt; b-a, a &lt; b generates an array with a single element, equal to a', () => {
		assert.deepEqual(range(3, 10, 15), [3]);
	});

	it('range with three arguments a &amp; b &amp; c, a &gt; b, c &lt; 0 generates an array of elements a,a-c,a-2c and ends with the number not less than b', () => {
		assert.deepEqual(range(12, 7, -2), [12, 10, 8]);
	});

	it('final example in the Python docs', () => {
		assert.deepEqual(range(0, -10, -1), [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]);
	});

	it('should preserve -0', () => {
		assert.strictEqual(1 / range(-0, 1)[0], -Infinity);
	});

	it('negative range generates descending array', () => {
		assert.deepEqual(range(8, 5), [8, 7, 6]);
	});

	it('negative range generates descending array', () => {
		assert.deepEqual(range(-3), [0, -1, -2]);
	});
});

describe('forEach', () => {
	it('each iterators provide value and iteration count', () => {
		forEach([1, 2, 3], (num, i) => {
			assert.strictEqual(num, i + 1);
		});
	});

	it('context object property accessed', () => {
		const answers = [];

		forEach([1, 2, 3], function(num){ answers.push(num * this.multiplier); }, {multiplier: 5});
		assert.deepEqual(answers, [5, 10, 15]);
	});

	it('can iterate a simple array', () => {
		const answers = [];

		forEach([1, 2, 3], num => { answers.push(num); });
		assert.deepEqual(answers, [1, 2, 3]);
	});

	it('iterating over objects works, and ignores the object prototype', () => {
		const answers = [];
		const obj = {one: 1, two: 2, three: 3};

		obj.constructor.prototype.four = 4;
		forEach(obj, (value, key) => { answers.push(key); });
		assert.deepEqual(answers, ['one', 'two', 'three']);
		delete obj.constructor.prototype.four;
	});

	it('the function should be called only 3 times', () => {
		let count = 0;
		const obj = {1: 'foo', 2: 'bar', 3: 'baz'};

		forEach(obj, () => { count++; });
		assert.strictEqual(count, 3);
	});

	it('handles a null properly', () => {
		let answers = 0;

		forEach(null, () => { ++answers; });
		assert.strictEqual(answers, 0);

		forEach(false, () => {});

		const a = [1, 2, 3];

		assert.strictEqual(forEach(a, () => {}), a);
		assert.strictEqual(forEach(null, () => {}), null);
	});
});

describe('map', () => {
	it('should produce a new array of values by mapping each value in list through an iteratee', () => {
		assert.deepEqual(map([1, 2, 3], num => num * 3), [3, 6, 9]);
		assert.deepEqual(map({one: 1, two: 2, three: 3}, num => num * 3), [3, 6, 9]);
		assert.deepEqual(map([[1, 2], [3, 4]], first), [1, 3]);
	});

	it('should return doubled numbers', () => {
		const doubled = map([1, 2, 3], num => num * 2);

		assert.deepEqual(doubled, [2, 4, 6]);
	});

	it('should return tripled numbers with context', () => {
		const tripled = map([1, 2, 3], function(num){ return num * this.multiplier; }, {multiplier: 3});

		assert.deepEqual(tripled, [3, 6, 9]);
	});

	it('can use collection methods on Array-likes', () => {
		const ids = map({length: 2, 0: {id: '1'}, 1: {id: '2'}}, ({id}) => id);

		assert.deepEqual(ids, ['1', '2']);
	});

	it('should handle a null properly', () => {
		assert.deepEqual(map(null, noop), []);
	});

	it('should call with proper context', () => {
		assert.deepEqual(map([1], function() {
			return this.length;
		}, [5]), [1]);
	});

	it('should map predicate string to object properties', () => {
		const people = [{name: 'moe', age: 30}, {name: 'curly', age: 50}];

		assert.deepEqual(map(people, 'name'), ['moe', 'curly']);
	});
});

describe('find', () => {
	it('should return first found `value`', () => {
		const array = [1, 2, 3, 4];

		assert.strictEqual(find(array, n => n > 2), 3);
	});

	it('should return `undefined` if `value` is not found', () => {
		const array = [1, 2, 3, 4];

		assert.strictEqual(find(array, () => false), void 0);
	});

	it('iterates array-likes correctly', () => {
		const array = [1, 2, 3, 4];

		array.dontmatch = 55;
		assert.strictEqual(find(array, x => x === 55), void 0);
	});

	it('can be used as findWhere', () => {
		const list = [{a: 1, b: 2}, {a: 2, b: 2}, {a: 1, b: 3}, {a: 1, b: 4}, {a: 2, b: 4}];

		assert.deepEqual(find(list, {a: 1}), {a: 1, b: 2});
		assert.deepEqual(find(list, {b: 4}), {a: 1, b: 4});
	});

	it('undefined when not found', () => {
		const list = [{a: 1, b: 2}, {a: 2, b: 2}, {a: 1, b: 3}, {a: 1, b: 4}, {a: 2, b: 4}];

		assert.ok(!find(list, {c: 1}));
	});

	it('undefined when searching empty list', () => {
		assert.ok(!find([], {c: 1}));
	});

	it('found the first "2" and broke the loop', () => {
		const result = find([1, 2, 3], num => num * 2 === 4);

		assert.strictEqual(result, 2);
	});

	it('works on objects', () => {
		const obj = {
			a: {x: 1, z: 3},
			b: {x: 2, z: 2},
			c: {x: 3, z: 4},
			d: {x: 4, z: 1}
		};

		assert.deepEqual(find(obj, {x: 2}), {x: 2, z: 2});
		assert.deepEqual(find(obj, {x: 2, z: 1}), void 0);
		assert.deepEqual(find(obj, x => {
			return x.x === 4;
		}), {x: 4, z: 1});
	});
});

describe('filter', () => {
	it('can filter arrays', () => {
		const evenArray = [1, 2, 3, 4, 5, 6];
		const isEven = num => num % 2 === 0;

		assert.deepEqual(filter(evenArray, isEven), [2, 4, 6]);
	});

	it('can filter objects', () => {
		const evenObject = {one: 1, two: 2, three: 3};
		const isEven = num => num % 2 === 0;

		assert.deepEqual(filter(evenObject, isEven), [2]);
	});

	it('predicate string map to object properties', () => {
		const evenObject = {one: 1, two: 2, three: 3};

		assert.deepEqual(filter([{}, evenObject, []], 'two'), [evenObject]);
	});

	it('given context', () => {
		const evenObject = {one: 1, two: 2, three: 3};

		filter([1], function() {
			assert.strictEqual(this, evenObject);
		}, evenObject);
	});

	it('filter collections', () => {
		const list = [{a: 1, b: 2}, {a: 2, b: 2}, {a: 1, b: 3}, {a: 1, b: 4}];

		assert.deepEqual(filter(list, {a: 1}), [{a: 1, b: 2}, {a: 1, b: 3}, {a: 1, b: 4}]);
		assert.deepEqual(filter(list, {b: 2}), [{a: 1, b: 2}, {a: 2, b: 2}]);
	});

	it('Empty object accepts all items', () => {
		const list = [{a: 1, b: 2}, {a: 2, b: 2}, {a: 1, b: 3}, {a: 1, b: 4}];

		assert.deepEqual(filter(list, {}), list);
	});
});

describe('toArray', () => {
	it('arguments object is not an array', () => {
		assert.ok(!Array.isArray(arguments));	// eslint-disable-line
	});

	it('arguments object converted into array', () => {
		assert.ok(Array.isArray(toArray(arguments)));	// eslint-disable-line
	});

	it('array is cloned', () => {
		const a = [1, 2, 3];

		assert.notStrictEqual(toArray(a), a);
	});

	it('cloned array contains same elements', () => {
		const a = [1, 2, 3];

		assert.deepEqual(toArray(a), [1, 2, 3]);
	});

	it('object flattened into array', () => {
		const numbers = toArray({one: 1, two: 2, three: 3});

		assert.deepEqual(numbers, [1, 2, 3]);
	});

	it('maintains astral characters', () => {
		const hearts = '\uD83D\uDC95';
		const pair = hearts.split('');
		const expected = [pair[0], hearts, '&', hearts, pair[1]];

		assert.deepEqual(toArray(expected.join('')), expected);
	});

	it('empty string into empty array', () => {
		assert.deepEqual(toArray(''), []);
	});
});
