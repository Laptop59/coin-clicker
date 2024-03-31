const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
	mode: "production",
	plugins: [
		new MiniCssExtractPlugin({
			filename: "[name].css",
			chunkFilename: "[id].css",
		}),
	],
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader'],
			},
		],
	},
	optimization: {
		minimize: true,
		minimizer: [
			new CssMinimizerPlugin(),
			new TerserPlugin({
				terserOptions: {
					ecma: 5,
					compress: {
						arguments: true,
						booleans_as_integers: true,
						booleans: true,
						collapse_vars: true,
						comparisons: true,
						computed_props: true,
						conditionals: true,
						dead_code: true,
						defaults: true,
						directives: true,
						drop_debugger: true,
						ecma: 5,
						evaluate: true,
						expression: true,
						hoist_funs: true,
						hoist_props: true,
						hoist_vars: true,
						ie8: true,
						if_return: true,
						join_vars: true,
						keep_classnames: true,
						keep_fargs: true,
						keep_fnames: true,
						keep_infinity: true,
						loops: true,
						module: true,
						negate_iife: true,
						properties: true,
						pure_new: true,
						reduce_funcs: true,
						reduce_vars: true,
						side_effects: true,
						switches: true,
						toplevel: true,
						typeofs: true,
						unsafe_arrows: true,
						unsafe: true,
						unsafe_comps: true,
						unsafe_Function: true,
						unsafe_math: true,
						unsafe_symbols: true,
						unsafe_methods: true,
						unsafe_proto: true,
						unsafe_regexp: true,
						unsafe_undefined: true,
						unused: true
					},
					keep_classnames: false,
					keep_fnames: false
				}
			}),
		],
	},
	devtool: 'source-map',
});