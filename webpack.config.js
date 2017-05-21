'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Temporary fix for css-loader/post-css
// 'Module build failed: ReferenceError: Promise is not defined'
//require('babel/polyfill');

var webpack = require('webpack');
var path = require('path');

var loaders = ['babel'];
var port = process.env.PORT || 3000;

//let autoprefixer = require('autoprefixer');
//let precss = require('precss')


var devtool;
var plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
];
var entry = {
  'demo0-simple': './demos/demo0-simple/simple.js',
  'demo1-simple': './demos/demo1-simple/simple-remove.js',
  'demo2-hide-todo': './demos/demo2-hide-todo/hide-todo.js',
  //'demo3-todomvc-list-transition': './demos/demo3-todomvc-list-transition/index.jsx',
  //'demo4-photo-gallery': './demos/demo4-photo-gallery/index.jsx',
  'demo5-todo-animation': './demos/demo5-todo-animation/todo-animation',
  //'demo7-water-ripples': './demos/demo7-water-ripples/index.jsx',
  //'demo8-draggable-list': './demos/demo8-draggable-list/index.jsx',
};

if (process.env.NODE_ENV === 'development') {
  devtool ='eval-source-map';
  loaders = ['react-hot'].concat(loaders);
  plugins = plugins.concat([
    new webpack.HotModuleReplacementPlugin()
  ]);
  entry = Object.keys(entry).reduce(function (result, key) {
    result[key] = [
      'webpack-dev-server/client?http://0.0.0.0:' + port,
      'webpack/hot/only-dev-server',
      entry[key]
    ];
    return result;
  }, {});
} else {
  devtool ='source-map';
  plugins = plugins.concat([
    new webpack.optimize.OccurenceOrderPlugin()
  ]);
}

module.exports = {
  devtool: devtool,
  entry: entry,
  output: {
    filename: '[name]/all.js',
    publicPath: '/demos/',
    path: __dirname + '/demos/',
  },
  module: {
    rules: [{
      test:  [/\.js$/, /\.jsx$/, /\.es6$/],
      exclude: /build|lib|bower_components|node_modules/,
      use: [{
        loader: "babel-loader?cacheDirectory=true"
      }]
    }, {
      test: /\.css$/,
      include: [
        path.resolve(__dirname, 'demos'),
        path.resolve(__dirname, 'node_modules')
      ],
      use: [
        'style-loader',
        'css-loader',
        'less-loader'
      ]
    },
      {
        test: /\.less$/,
        include: [
          path.resolve(__dirname, 'demos'),
          path.resolve(__dirname, 'node_modules')
        ],
        use: [
          'style-loader',
          'css-loader',
          //'postcss-loader',
          'less-loader'
        ]
      }]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: plugins
};
