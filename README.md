# webpack-test-2
A test of some more webpack concepts

In this case specifically, usage with multi-page apps such as with Django.

Each page would typically have:
* `appname/templates/subdir/pageX.html`
* `appname/static/subdir/pageX.js` -- compiled from `pageX.js6`
* `appname/static/subdir/pageX.css` -- compiled from `pageX.less`

Goals:
- [x] compile of ES6/ES2015 into common JS
- [x] compile of LESS into common CSS
- [x] use of Yarn instead of direct use of npm
- [x] automatic detection of .less and .js6 files to be compiled
  * else a simple listing in a single configuration file
  * files must be located in a variety of subdirectories, not only __dirname or one fixed directory
- [x] target output in same folder would be ideal, for minimum directory-shuffling during development
- [x] minification and also source maps, for ideal delivery speed without sacrificing debugging
- [ ] interpolation of **hash** entity into .html template files for cache-busting
- [x] a watch mode so modified files will be recompiled
  * npm takes several seconds to start, so `npm run build` can take 10+ seconds compared to gulp under 1 second
