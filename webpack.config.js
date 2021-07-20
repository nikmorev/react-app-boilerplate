const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')


const isProd = process.env.NODE_ENV === 'production'
const filename = ext => `[name]${isProd ? '.[fullhash]' : ''}.${ext}`
const relativePath = p => path.resolve(__dirname, `./${p||''}`)
const distPath = path.resolve(__dirname, './dist')


const linariaLoader = {
    loader: '@linaria/webpack-loader',
    options: { sourceMap: !isProd },
}


module.exports = {
    target: isProd ? 'browserslist' : 'web',
    mode: isProd ? 'production' : 'development',
    context: relativePath('src'),
    entry: { 
        main: "./index.tsx",
        vendor: [
            'react',
            'react-dom',
            'redux'
        ],
    },
    output: {
        path: distPath,
        filename: filename('js'),
        publicPath: '/'
    },
    resolve: {
        alias: {
            '@': relativePath('src'),
            'Components': relativePath('src/components'),
            'Containers': relativePath('src/containers'),
            'Helpers': relativePath('src/helpers'),
            'Config': relativePath('src/config'),
            'Store': relativePath('src/store'),
        },
        extensions: ['.tsx', '.jsx', '.ts', '.js'],
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: relativePath('src/index.html'),
            minify: isProd,
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: filename('css'),
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js(x)?$/,
                exclude: '/node_modules/',
                use: [
                    'babel-loader',
                    linariaLoader
                ]
            }, {
                test: /\.tsx?$/,
                exclude: '/node_modules/',
                use: [
                    'babel-loader',
                    linariaLoader,
                    'ts-loader', /* Use it instead @babel/preset-typescript to guarantee type-safety */
                ]
            }, {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: { 
                            sourceMap: !isProd
                        }
                    }
                ]
            }
        ]
    },
    devServer: {
        port: 3001,
        hot: true,
        historyApiFallback: true,
        contentBase: distPath,
    },
    optimization: {
        minimize: isProd,
        minimizer: [new TerserWebpackPlugin()],
        runtimeChunk: isProd ? 'multiple' : 'single'
    },
}
