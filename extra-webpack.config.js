const webpack = require('webpack');

module.exports = {
  resolve: {
    fallback: {
      "vm": require.resolve("vm-browserify"),
      "crypto": require.resolve('crypto-browserify'),
      "stream": require.resolve("stream-browserify"),
      "util": require.resolve("util"),
      "buffer": require.resolve("buffer"),
      "process": require.resolve("process/browser"),
      "assert": require.resolve("assert"),
      "url": require.resolve("url"),
      "fs": false,
      "net": false,
      "tls": false
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
    new webpack.DefinePlugin({
      global: 'globalThis',
    }),
  ],
};
