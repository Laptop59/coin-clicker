const path = require('path')
const CopyPlugin = require("copy-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext][query]'
        }
      },
      {
        test: /\.svg$/i,
        type: 'asset/inline'
      },
      {
        test: /\.(mp3|wav|ogg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'sounds/[hash][ext][query]'
        }
      },
      {
        test: /\.(otf|ttf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext][query]'
        }
      },
      {
        test: /\.ico$/i,
        type: 'asset/resource'
      },
    ],
  },
  plugins: [
    new CopyPlugin({
        patterns: [
          { from: "./src/html/favicon.ico", to: "./" },
        ],
    }),
    new HtmlWebpackPlugin({
        title: "Coin Clicker"
    })
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 3000,
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  mode: "development"
}