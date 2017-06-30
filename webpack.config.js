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
             * Babel + ES2015 via loader; lint and transpile
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
             * Plain JS files
             */

            /*
             * CSS files and also LESS-to-CSS all go into bundle.css
             * this being an afterthought/plugin we do need to specify the filenames
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
