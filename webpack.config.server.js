
// https://babeljs.io/docs/usage/babel-register/
// By default babel-node and babel-register save to a json cache in temporary directory
// BABEL_CACHE_PATH=/foo/my-cache.json (specify location)
// BABEL_DISABLE_CACHE=1 (disable cache)

const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {

  entry: path.join(__dirname, './server/server.js'),

  output: {
    filename: 'server.bundle.js',
    path: path.join(__dirname, './build/server'),
    publicPath: '/build/server/'
  },

  target: 'node',

  node: {
    __dirname: true,
    __filename: true,
  },

  externals: [ nodeExternals({ importType: 'commonjs' }) ],

  module: {

    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              ['env', {'targets': { 'browsers': ['last 2 versions'] }}],
              'stage-0',
              'react'
            ],
            plugins: [
              [
                'transform-decorators-legacy',
                'babel-plugin-webpack-loaders', {
                  config: './webpack.config.babel.js',
                  verbose: false,
                }
              ],
            ]
          },
        }]
      },
      {
        test: /\.json$/,
        use: [{
          loader: 'json-loader',
          options: {
            /* ... */
          }
        }]
      },
    ]
  },

};
