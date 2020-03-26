# package-utils [![Build Status](https://travis-ci.com/jonkemp/package-utils.svg?branch=master)](https://travis-ci.com/jonkemp/package-utils)

> Helper utility modules for collections, arrays, objects and more.

Inspired by `_`. 😄


## Install

Install with [npm](https://npmjs.org/package/@jonkemp/package-utils)

```
$ npm install @jonkemp/package-utils
```

## Usage

### forEach

Iterates over a list of elements, yielding each in turn to an iteratee function. The iteratee is bound to the context object, if one is passed. Each invocation of iteratee is called with three arguments: (element, index, list). If list is a JavaScript object, iteratee's arguments will be (value, key, list). Returns the list for chaining.

```js
forEach([1, 2, 3], alert);
//=> alerts each number in turn...

forEach({one: 1, two: 2, three: 3}, alert);
//=> alerts each number value in turn...
```

### map

Produces a new array of values by mapping each value in list through a transformation function (iteratee). The iteratee is passed three arguments: the value, then the index (or key) of the iteration, and finally a reference to the entire list.

```js
map([1, 2, 3], num => num * 3);
//=> [3, 6, 9]

map({one: 1, two: 2, three: 3}, (num, key) => num * 3);
//=> [3, 6, 9]

map([[1, 2], [3, 4]], first);
//=> [1, 3]
```

### find

Looks through each value in the list, returning the first one that passes a truth test (predicate), or undefined if no value passes the test. The function returns as soon as it finds an acceptable element, and doesn't traverse the entire list. predicate is transformed through iteratee to facilitate shorthand syntaxes.

```js
const even = find([1, 2, 3, 4, 5, 6], num => num % 2 == 0);
//=> 2
```

### filter

Looks through each value in the list, returning an array of all the values that pass a truth test (predicate). predicate is transformed through iteratee to facilitate shorthand syntaxes.

```js
const evens = filter([1, 2, 3, 4, 5, 6], num => num % 2 == 0);
//=> [2, 4, 6]
```

### toArray

Creates a real Array from the list (anything that can be iterated over). Useful for transmuting the arguments object.

```js
(function(...args) { return toArray(args).slice(1); })(1, 2, 3, 4);
//=> [2, 3, 4]
```

### first

Returns the first element of an array. Passing n will return the first n elements of the array.

```js
first([5, 4, 3, 2, 1]);
//=> 5
```

### initial

Returns everything but the last entry of the array. Especially useful on the arguments object. Pass n to exclude the last n elements from the result.

```js
initial([5, 4, 3, 2, 1]);
//=> [5, 4, 3, 2]
```

### flatten

Flattens a nested array (the nesting can be to any depth). If you pass shallow, the array will only be flattened a single level.

```js
flatten([1, [2], [3, [[4]]]]);
//=> [1, 2, 3, 4];

flatten([1, [2], [3, [[4]]]], true);
//=> [1, 2, 3, [[4]]];
```

### findIndex

Similar to indexOf, returns the first index where the predicate truth test passes; otherwise returns -1.

```js
findIndex([4, 6, 8, 12], isPrime);
//=> -1 // not found

findIndex([4, 6, 7, 12], isPrime);
//=> 2
```

### range

A function to create flexibly-numbered lists of integers, handy for each and map loops. start, if omitted, defaults to 0; step defaults to 1. Returns a list of integers from start (inclusive) to stop (exclusive), incremented (or decremented) by step, exclusive. Note that ranges that stop before they start are considered to be zero-length instead of negative — if you'd like a negative range, use a negative step.

```js
range(10);
//=> [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

range(1, 11);
//=> [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

range(0, 30, 5);
//=> [0, 5, 10, 15, 20, 25]

range(0, -10, -1);
//=> [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]

range(0);
//=> []
```

### getKeys

Retrieve all the names of the object's own enumerable properties.

```js
getKeys({one: 1, two: 2, three: 3});
//=> ["one", "two", "three"]
```

### allKeys

Retrieve all the names of object's own and inherited properties.

```js
function Stooge(name) {
  this.name = name;
}
Stooge.prototype.silly = true;
allKeys(new Stooge("Moe"));
//=> ["name", "silly"]
```

### values

Return all of the values of the object's own properties.

```js
values({one: 1, two: 2, three: 3});
//=> [1, 2, 3]
```

### toPairs
Convert an object into a list of [key, value] pairs. The opposite of object.

```js
toPairs({one: 1, two: 2, three: 3});
//=> [["one", 1], ["two", 2], ["three", 3]]
```

### findKey

Similar to findIndex but for keys in objects. Returns the key where the predicate truth test passes or undefined. predicate is transformed through iteratee to facilitate shorthand syntaxes.

### hasProperty

Does the object contain the given key? Identical to object.hasOwnProperty(key), but uses a safe reference to the hasOwnProperty function, in case it's been overridden accidentally.

```js
hasProperty({a: 1, b: 2, c: 3}, "b");
//=> true
```

### property

Returns a function that will return the specified property of any passed-in object. path may be specified as a simple key, or as an array of object keys or array indexes, for deep property fetching.

```js
const stooge = {name: 'moe'};
'moe' === property('name')(stooge);
//=> true

const stooges = {moe: {fears: {worst: 'Spiders'}}, curly: {fears: {worst: 'Moe'}}};
const curlysWorstFear = property(['curly', 'fears', 'worst']);
curlysWorstFear(stooges);
//=> 'Moe'
```

### matcher

Returns a predicate function that will tell you if a passed in object contains all of the key/value properties present in attrs.

```js
const ready = matcher({selected: true, visible: true});
const readyToGoList = filter(list, ready);
```

### isMatch

Tells you if the keys and values in properties are contained in object.

```js
const stooge = {name: 'moe', age: 32};
isMatch(stooge, {age: 32});
//=> true
```

### isObject

Returns true if value is an Object. Note that JavaScript arrays and functions are objects, while (normal) strings and numbers are not.

```js
isObject({});
//=> true

isObject(1);
//=> false
```

### isArguments

Returns true if object is an Arguments object.

```js
(function(...args) { return isArguments(args); })(1, 2, 3);
//=> true

isArguments([1,2,3]);
//=> false
```

### isFunction

Returns true if object is a Function.

```js
isFunction(alert);
// => true
```

### isString

Returns true if object is a String.

```js
isString('moe');
//=> true
```

### isNumber

Returns true if object is a Number (including NaN).

```js
isNumber(8.4 * 5);
//=> true
```

### isUndefined

Returns true if value is undefined.

```js
isUndefined(window.missingVariable);
//=> true
```

### identity

Returns the same value that is used as the argument. In math: f(x) = x
This function looks useless, but is used throughout Underscore as a default iteratee.

```js
const stooge = { name: 'moe' };
stooge === identity(stooge);
//=> true
```

### constant

Creates a function that returns the same value that is used as the argument of constant.

```js
const stooge = { name: 'moe' };
stooge === constant(stooge)();
//=> true
```

### noop

Returns undefined irrespective of the arguments passed to it. Useful as the default for optional callback arguments.

```js
obj.initialize = noop;
```

---
| **Like us a lot?** Help others know why you like us! **Review this package on [pkgreview.dev](https://pkgreview.dev/npm/package-utils)** | ➡   | [![Review us on pkgreview.dev](https://i.ibb.co/McjVMfb/pkgreview-dev.jpg)](https://pkgreview.dev/npm/package-utils) |
| ----------------------------------------------------------------------------------------------------------------------------------------- | --- | --------------------------------------------------------------------------------------------------------------------- |

## License

MIT
