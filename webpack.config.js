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
             * replace [hash] entities in the .src.html to generate .html
             * typically used on .js and .css filenames to include a random hash for cache-busting
             * though could be used to cache-bust nearly anything such as images
             * tip: HTML file basenames (like any) should be fairly minimal: letters and numbers, - _ . characters
             */
            {
                test: /\.src\.html$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            // replace .src.html with just .html
                            name: '[path][1].html',
                            regExp: '([\\w\\-\.]+)\\.src\\.html$',
                        },
                    },
                    {
                        loader: StringReplacePlugin.replace({
                        replacements: [
                            {
                                pattern: /\[hash\]/g,
                                replacement: function (match, p1, offset, string) {
                                    return randomhash;
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
             * webpack scans the HTML files and will throw a fit if we don't account for every single file it finds
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
        new StringReplacePlugin(),
    ]
};
