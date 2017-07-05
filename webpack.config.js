// the list of .js6 files for the pages
// there must be a .js6 and .less file, which will be turned into .js and .css outputs
// these .js6 files are both executable JS code for the page, as well as require() statements to load additional stuff foor the page
//
// but don't stop using CDNs and SCRIPT tags! they give great performance, compared to bundling everything

const JS6_FILES = [
    './static/pages1and3/page1.js6',
    './static/pages2and4/page2.js6',
    './static/pages1and3/page3.js6',
    './static/pages2and4/page4.js6'
];

/////////////////////////////////////////////////////////////////////////////////////////////////////////

const ExtractTextPlugin = require("extract-text-webpack-plugin");

var StringReplacePlugin = require("string-replace-webpack-plugin");

const randomhash = Math.round(Math.random() * 1000000000); // for cace-busting "hash" replacement

module.exports = {
    /*
     * multiple entry points, one per entry
     * the [name] for each is the basename, e.g. some/path/to/thing so we can add .js and .css suffixes
     * the values are the files with their .js6 suffixes retained
     */
    entry: JS6_FILES.reduce((o, key) => { o[key.replace(/\.js6$/, '')] = key; return o; }, {}),
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
                    use: [
                        { loader: 'css-loader', options: { minimize: true, sourceMap: true, url: false } }
                    ],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        { loader: 'css-loader', options: { minimize: true, sourceMap: true, url: false } },
                        { loader: 'less-loader', options: { sourceMap:true } },
                    ],
                    fallback: 'style-loader'
                })
            },

            /*
             * HTML Files
             * replace .js and .css filenames to include a random hash for cache-busting
             * HTML syntax counts!
             * - the src/href must be last attribute
             * - tags must close properly
             * - there must be a ?XXXX to be replaced and XXXX must be numbers
             * - the HTML files MUST have these tags or build will fail (to make sure you don't forget)
             * Example: <script src="some/path/page3.js?00000"></script>
             * Example: <link href="some/path/page3.css?00000" />
             */
            {
                test: /.html$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].html',
                        },
                    },
                    {
                        loader: StringReplacePlugin.replace({
                        replacements: [
                            {
                                pattern: /\.js\?\d+">\s*<\/script>/g,
                                replacement: function (match, p1, offset, string) {
                                    return '.js?' + randomhash + '"></script>';
                                }
                            },
                            {
                                pattern: /\.css\?\d+"\s*\/>/g,
                                replacement: function (match, p1, offset, string) {
                                    return '.css?' + randomhash + '" />';
                                }
                            },
                        ]})
                    }
                ]
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
     * enable source maps, applicable to both JS and CSS
     */
    devtool: "nosources-source-map",

    /*
     * plugins for the above
     */
    plugins: [
        // CSS output from the CSS + LESS handlers above
        new ExtractTextPlugin({
            disable: false,
            filename: '[name].css'
        }),
        // for doing string replacements on files
        new StringReplacePlugin()
    ]
};
