const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const LiveReloadPlugin = require('webpack-livereload-plugin')

const mode = process.env.NODE_ENV || 'development'
const devMode = mode !== 'production'

const config = [
    {
        entry: {
            bundle: ['./src/index.ts']
        },
        resolve: {
            alias: {
                svelte: path.resolve('node_modules', 'svelte'),
                '~': path.resolve('src-ui')
            },
            extensions: ['.mjs', '.ts', '.js', '.svelte'],
            mainFields: ['svelte', 'browser', 'module', 'main']
        },
        output: {
            path: __dirname + '/dist'
        },
        optimization: {
            minimize: false
        },
        node: {
            __dirname: false,
            fs: 'empty'
        },
        module: {
            noParse: /\.wasm$/,
            rules: [
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: true,
                                experimentalWatchApi: true
                            }
                        }
                    ],
                    exclude: /node_modules/
                },
                {
                    test: /\.svelte$/,
                    use: {
                        loader: 'svelte-loader',
                        options: {
                            hotReload: devMode,
                            emitCss: true
                        }
                    }
                },
                {
                    test: /\.wasm$/,
                    loaders: ['base64-loader'],
                    type: 'javascript/auto'
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: '../',
                                hmr: devMode
                            }
                        },
                        'css-loader'
                    ]
                }
            ]
        },
        plugins: [new CopyPlugin([{ from: './src/assets/*', to: './', flatten: true }]), new MiniCssExtractPlugin()],
        mode
    },
    {
        mode,
        target: 'electron-main',
        entry: {
            main: './src/native/index.ts',
            preload: './src/native/preload.ts',
            entangled: './src/native/entangled.ts'
        },
        externals: ['entangled-node'],
        node: {
            __dirname: false
        },
        optimization: {
            minimize: false
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: true,
                                experimentalWatchApi: true
                            }
                        }
                    ],
                    exclude: /node_modules/
                },
                {
                    test: /\.node$/,
                    use: 'node-loader'
                }
            ]
        },
        resolve: {
            extensions: ['.ts', '.json']
        },
        output: {
            path: path.join(__dirname, 'dist'),
            libraryTarget: 'commonjs2',
        }
    }
]

if (devMode) {
    config[0].devServer = {
        contentBase: path.join(__dirname, 'dist'),
        port: 3000
    }
    config[0].plugins.push(new LiveReloadPlugin())
}

module.exports = config
