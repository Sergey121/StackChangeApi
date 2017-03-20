const webpack = require('webpack');
const helpers = require('./utils/helpers');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');

function makeConfig(env = {}) {

    let plugins = [
        new CleanWebpackPlugin(['dist']),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors'
        }),
        new CopyWebpackPlugin([
            {
                from: 'frontend/images',
                to: 'images'
            },
            {
                from: 'frontend/index.html',
                to: 'index.html'
            }
        ]),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
            helpers.root('./frontend'),
            {}
        ),
        new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en-gb|en-au|en-ca|en-ie|en-nz)$/),
    ];

    if (env.prod === 'true') {
        plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    drop_console: false,
                }
            })
        )
    }

    if (env.analyze === 'true') {
        let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
        plugins.push(
            new BundleAnalyzerPlugin({
                analyzerMode: 'static'
            })
        )
    }

    return {
        entry: {
            'app.default': './frontend/app.js',
            'vendors': './frontend/vendors.js'
        },
        output: {
            path: __dirname + '/dist',
            filename: '[name].js'
        },
        cache: true,
        watch: env.watch === 'true',
        plugins: plugins,
        resolveLoader: {
            alias: {
                'custom-pug-loader': path.join(__dirname, 'utils', 'customPugLoader'),
                'custom-css-to-string-loader': path.join(__dirname, 'utils', 'customCssToStringLoader')
            }
        },
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use: [
                        {loader: 'custom-css-to-string-loader'},
                        {loader: 'css-loader', options: {url: false}},
                        {loader: 'sass-loader'}
                    ]
                },
                {
                    test: /\.pug$/,
                    use: [
                        {loader: 'custom-pug-loader'}
                    ]
                },
                {
                    test: /\.js$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: ['es2015', 'angular2']
                            }
                        }
                    ]
                }
            ]
        },
        devServer: {
            inline: true,
            port: 8000,
            open: true,
            contentBase: './dist'
        }
    }
}


module.exports = makeConfig;
