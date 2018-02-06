const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
//const BabelWebpackPlugin = require('babel-minify-webpack-plugin')
const autoprefixer = require('autoprefixer')
const relpath = path.join.bind(path, __dirname)

const NPM_EVENT = process.env.npm_lifecycle_event
const NODE_ENV = process.env.NODE_ENV || 'development'
const isTestEnv = NODE_ENV === 'test'
const isProductionCode = NODE_ENV === 'production'
const isDevelopmentServer = NPM_EVENT === 'start'

const paths = {
  dist: relpath(`./dist/${NODE_ENV}`),
  appEntry: relpath('./src/app/index'),
  indexHtml: relpath('./src/app/index.html'),
  icon: relpath('./src/app/favicon.ico'),
  src: relpath('./src'),
  lib: relpath('./node_modules')
}

module.exports = {
  devtool: getSourceMap(),
  bail: !isDevelopmentServer,
  entry: getEntryPoints(),
  output: {
    path: paths.dist,
    filename: '[name].[hash].bundle.js'
  },
  plugins: getPlugins(),
  resolve: {
    modules: [
      path.join(__dirname, 'src'),
      'node_modules'
    ],
    alias: {
      util: path.join(__dirname, '/node_modules/foundation-sites/scss/util/_util.scss')
    }
  },
  externals: {
    jQuery: 'jQuery',
    foundation: 'Foundation'
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: true,
                localIdentName: '[path]___[name]__[local]___[hash:base64:5]'
              }
            },
            'sass-loader'
          ]
        }),
        include: paths.src
      }, {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      // **IMPORTANT** This is needed so that each foundation js file required by
      // foundation-webpack has access to the jQuery object
      {
        test: /foundation\/js\//,
        loader: 'imports-loader?jQuery=jquery',
        include: paths.src
      },
      {
        test: /\.json$/,
        loaders: ['json-loader']
      }, {
        test: /\.js$/,
        use: 'babel-loader',
        include: [
          paths.src,
          /* note! add here all modules that dist es6, because IE won't load them ... */
          path.resolve(__dirname, 'node_modules/foundation-sites'),  //needed for production - for IE mainly
          path.resolve(__dirname, 'node_modules/react-image-viewer-zoom')
        ]
      }, /*{
        test: /\.jsx?$/,
        loaders: ['babel-loader'],
        include: paths.src
      },*/ {
        test: /\.yaml$/,
        use: [
          {
            loader: 'yaml-loader'
          }
        ],
        include: paths.src
      },
      {
        test: /\.(png|gif|jpg|jpeg|eot|otf|woff|ttf|svg)?$/,
        loaders: ['url-loader'],
        include: [paths.src,
          path.resolve(__dirname, 'node_modules/react-viewer/dist')
        ]
      }
    ]
  }
}

function getSourceMap() {
  // TestEnv source-maps:
  // cheap-module-source-map - fastest that works in the console
  // inline-source-map - works in chrome (for debugging)
  return isTestEnv ? 'inline-source-map' :
    isDevelopmentServer ? 'eval-source-map' :
      'source-map'
}

function getEntryPoints() {
  return isDevelopmentServer
    ? [
      'babel-polyfill',
      'eventsource-polyfill', // necessary for hot reloading with IE
      'webpack-hot-middleware/client',
      paths.appEntry,
      `foundation-sites-loader!${__dirname}/foundation-sites.config.js`
    ]
    : [
      'babel-polyfill',
      paths.appEntry,
      `foundation-sites-loader!${__dirname}/foundation-sites.config.js`  //without that, foundation will not work on production dist
    ]
}

function getPlugins() {

  let plugins = [
    new CleanWebpackPlugin(paths.dist),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: `html-loader!${paths.indexHtml}`,
      favicon: paths.icon,
      inject: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(NODE_ENV)
      }
    })
  ]

  if (isDevelopmentServer) {
    plugins = plugins.concat([
      new ExtractTextPlugin('[name].[hash].css', { allChunks: true }),
      new webpack.HotModuleReplacementPlugin()
    ])
  }

  if (isProductionCode) {
    plugins = plugins.concat([
      new ExtractTextPlugin('[name].[hash].css', { allChunks: true }),
      //new webpack.optimize.OccurenceOrderPlugin()
      //new BabelWebpackPlugin()  //use that if es6 problems will prevent UglifyJsPlugin from working
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false
        }
      })
    ])
  }

  return plugins
}
