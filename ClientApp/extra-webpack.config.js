const webpack = require('webpack');

const API_URL = process.env.API_URL || 'http://localhost/';

// https://codeburst.io/customizing-angular-cli-6-build-an-alternative-to-ng-eject-a48304cd3b21
module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify(API_URL)
    }),
  ],
  resolve: {
    alias: {
      "crypto": "crypto-browserify"
    }
  },
  node: {
    vm: true,
    stream: true
  }
};