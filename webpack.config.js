const path = require('path')
const CopyPlugin = require("copy-webpack-plugin")

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico|mp3|wav|ogg|otf|ttf)$/i,
        type: 'asset/resource',
      }
    ],
  },
  plugins: [
    new CopyPlugin({
        patterns: [
          { from: "./src/html", to: "./" },
          { from: './src/sounds', to: './sounds/' }
        ],
    }),
  ],
  resolve: {
    extensions: ['.js'],
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