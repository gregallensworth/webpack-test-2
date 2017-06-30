const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    /*
     * separate entry points: each js6 is bundled+compiled into samename.js
     * this would include not only the JS code but also any LESS, CSS, JS, JS2015 files which are require()'d thereby
     */
    entry: {
        page1: './page1.js6',
        page2: './page2.js6',
        page3: './page3.js6',
        page4: './page4.js6'
    },
    output: {
        path: __dirname,
        filename: '[name].js'
    },

    module: {
        loaders: [
            /*
             * Plain JS files
             * just kidding; Webpack already does those without any configuration  :)
             * but we do not want to lump them in with ES6 files: they would be third-party and then run through JSHint and we can't waste time linting third-party JS
             */

            /*
             * run .js6 files through Babel + ES2015 via loader; lint and transpile into X.js
             * that's our suffix for ECMAScript 2015 / ES6 files
             */
            {
                test: /\.js6$/,
                use: [
                    { loader: 'babel-loader', options: { presets: ['es2015'] } },
                    { loader: 'jshint-loader', options: { esversion: 6, emitErrors: true, failOnHint: true } }
                ],
                exclude: /node_modules/
            },

            /*
             * CSS files and also LESS-to-CSS all go into one bundled X.css
             */
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: [ { loader: 'css-loader' } ],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    use: [ { loader: 'css-loader' }, { loader: 'less-loader' } ],
                    fallback: 'style-loader'
                })
            },

            /*
             * Files to ignore
             * Notably from CSS, e.g. background-image SVG, PNGs, JPEGs, fonts, ...
             * we do not need them processed; our stylesheets etc. will point to them in their proper place
             */
            {
                test: /\.(svg|gif|jpg|jpeg|png)$/,
                loader: 'ignore-loader'
            },
            {
                test: /\.(woff|woff2|ttf|eot)$/,
                loader: 'ignore-loader'
            }
        ]
    },

    /*
     * plugins for the above
     */
    plugins: [
        // CSS output from the CSS + LESS handlers above
        new ExtractTextPlugin({
            disable: false,
            filename: '[name].css'
        }),
    ]
};
