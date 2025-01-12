const rspack = require('@rspack/core')
const path = require('path')
const { RspackManifestPlugin } = require('rspack-manifest-plugin')

const isDev = process.env.NODE_ENV === 'development'

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ["chrome >= 87", "edge >= 88", "firefox >= 78", "safari >= 14"];

/** @type {import('@rspack/cli').Configuration} */
module.exports = {
  mode: isDev ? 'development' : 'production',
  // stats: 'minimal',
  entry: {
    main: path.resolve(__dirname, "app/javascript/main.tsx"),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json']
  },
  output: {
    path: path.resolve(__dirname, "public/packs"),
    publicPath: isDev ? "http://localhost:8081/packs" : "/packs/",
    filename: isDev ? "[name].js" : "[name]-[hash].js",
  },
  devServer: {
    // proxy: [
    //   {
    //     context: ['/'],
    //     target: 'http://localhost:8080',
    //     // changeOrigin: true,
    //   },
    // ],
    port: 8081,
    static: path.resolve(__dirname, 'public/packs'),
    compress: true,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  plugins: [
    new rspack.CssExtractRspackPlugin({}),
    // new rspack.HtmlRspackPlugin({
    //   template: path.resolve(__dirname, 'index.html'),
    //   title: 'Rspack + React + TS'
    // }),
    new RspackManifestPlugin({
      writeToFileEmit: true
    })
  ],
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: true,
                decorators: false,
                dynamicImport: false
              },
              transform: {
                react: {
                  runtime: 'automatic'
                }
              }
            },
            sourceMaps: true,
            env: { targets }
          }
        }
      },
      {
        test: /\.s?css$/i,
        exclude: /(node_modules)/,
        use: [
          rspack.CssExtractRspackPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                mode: (resourcePath) => {
                  if (/\.module\.s?css$/i.test(resourcePath)) {
                    return 'local'
                  }
                  return 'global'
                },
                namedExport: false,
                localIdentName: isDev ? '[name]__[local]' : '[hash:base64]',
              },
            },
          },
          'sass-loader',
        ],
      },
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new rspack.SwcJsMinimizerRspackPlugin(),
    ]
  }
}
