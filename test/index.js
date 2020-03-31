const assert = require('assert');
const {
	identity,
	constant,
	allKeys,
	isFunction,
	isNumber,
	isUndefined,
	property,
	matcher,
	flatten,
	forEach,
	map
} = require('..');
const {
	noop,
	find,
	filter,
	range,
	first
} = require('./utils');

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
