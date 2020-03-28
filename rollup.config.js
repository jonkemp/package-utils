import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default [{
	input: './lib/flatten.js',
	output: {
		file: '../flat-util/index.js',
		format: 'cjs',
		strict: false
	},
	plugins: [
		commonjs(),
		resolve()
	]
},
{
	input: './lib/for-each.js',
	output: {
		file: '../for-each-plus/index.js',
		format: 'cjs',
		strict: false
	},
	plugins: [
		commonjs(),
		resolve()
	]
},
{
	input: './lib/map.js',
	output: {
		file: '../map-plus/index.js',
		format: 'cjs',
		strict: false
	},
	plugins: [
		commonjs(),
		resolve()
	]
}];
