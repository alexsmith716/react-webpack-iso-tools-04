
const PUBLIC_PATH = '/';

const webpack = require('webpack');
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpackIsomorphicToolsConfig = require('./webpack.config.tools');
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const bootstrapEntryPoints = require('./webpack.bootstrap.config');

console.log('>>>>>> webpack.config.dev <<<<<<<<');
console.log('>>>> bootstrap-loader configuration: ', `${bootstrapEntryPoints.dev}`);

module.exports = {

  entry: {
    app: [
      'webpack-hot-middleware/client',
      'webpack/hot/only-dev-server',
      'react-hot-loader/patch',
      'babel-polyfill',
      bootstrapEntryPoints.dev,
      path.join(__dirname, './client/index.js')
    ],
    vendor: [
      'isomorphic-fetch',
      'react',
      'react-bootstrap',
      'react-dom',
      'react-redux',
      'react-router',
      'react-router-bootstrap',
      'react-router-config',
      'react-router-dom',
      'redux',
      'redux-thunk',
    ]
  },

  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: '/',
  },

  module: {
    rules: [

      {
        test: /\.jsx*$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' }
        ]
      },

      {
        test: /(global\.css)$/,
        use:[
          { loader: 'style-loader' }, 
          { loader: 'css-loader' }
        ],
      },

      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use:[
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[name]_[local]_[hash:base64:5]',
                sourceMap: true,
              }
            }, 
            {
              loader: 'postcss-loader',
            }, 
            {
              loader: 'sass-loader',
            }
          ]
        })
      },

      {
        test: /\.(woff|woff2)?(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: { limit: 10000, mimetype: 'application/font-woff' }
          }
        ]
      },

      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: { limit: 10000, mimetype: 'application/octet-stream' }
          }
        ]
      },

      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          { loader: 'file-loader' }
        ]
      },

      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: { limit: 10000, mimetype: 'image/svg+xml' }
          }
        ]
      },

      {
        test: /\.(jpe?g|gif|png)$/i,
        use: [
          {
            loader: 'url-loader',
            options: { limit: 10000 }
          }
        ]
      },

      {
        test: /\.json$/,
        use: [
          { loader: 'json-loader' }
        ]
      },
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx', '.css'],
  },

  devtool: 'inline-source-map',

  plugins: [

    new webpack.HotModuleReplacementPlugin(),

    // extract vendor related code to a bundle of its own
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: '[name].[hash].js'
    }),

    // global constants configured at compile time
    new webpack.DefinePlugin({
      'process.env': {
        CLIENT: JSON.stringify(true),
        NODE_ENV: JSON.stringify('development'),
        PUBLIC_PATH: JSON.stringify(PUBLIC_PATH),
      },
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true
    }),

    // Bootstrap 4 requires Tether:
    // new webpack.ProvidePlugin({
    //  'window.Tether': 'tether',
    //}),

    new WebpackIsomorphicToolsPlugin(webpackIsomorphicToolsConfig).development(),

    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      analyzerPort: 8888,
      defaultSizes: 'parsed',
      openAnalyzer: false,
      generateStatsFile: false
    })
  ]
};

// reqiured for jquery:
//{
//  test: /bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/,
//  use: [
//    {
//      loader: 'imports-loader?jQuery=jquery'
//    }
//  ]
//},
