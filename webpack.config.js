const nodeExternals = require('webpack-node-externals');
const fs = require('fs');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = (env) => {
  return {
    entry: {
      app: "./src/main.ts"
    },
    target: 'node',
    context: __dirname,
    externals: [nodeExternals()],
    output: {
      path: path.join(__dirname, '/dist'),
      filename: 'oflow-api.js',
    },
    plugins: [
      new CopyWebpackPlugin([{
        from: 'package.json'
      },
      {
        from: "app.json"
      },
      {
        from: 'yarn.lock'
      },
      {
        from: './src/swagger-docs',
        to: 'swagger-docs'
      },
      {
        from: './src/config/*.json',
        to: 'config',
        flatten: true
      }
      ]),
      new webpack.DefinePlugin({
        'process.env': {
          OFLOW_ENV: JSON.stringify(env),
          NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        },
      })
    ],
    node: {
      __dirname: false
    },
    resolve: {
      extensions: ['.ts', '.js', '.json']
    },
    module: {
      rules: [

        {
          test: /\.json/,
          type: 'javascript/auto',
          use: [{
            loader: 'json-loader'
          }]
        },
        {
          test: /\.ts/,
          use: [{
            loader: 'ts-loader'
          }]
        }
      ]

    }
  }
};
