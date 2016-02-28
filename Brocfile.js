var babel = require('broccoli-babel-transpiler');
var browserify = require('broccoli-browserify');
var env = require('broccoli-env').getEnv();
var MergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');
var concat = require('broccoli-concat');
var WatchedTree = require('broccoli-source').WatchedDir;

var outputTrees = [];

var src = new WatchedTree('src');

transpiledSrc = babel(src, {
  modules: 'system'
});

var js    = new Funnel(transpiledSrc, { exclude: ['tests/**/*'] });
var tests = new Funnel(transpiledSrc, {
  srcDir: 'tests',
  destDir: 'test-files',
  include: ['**/*'],
});


var output = new Funnel(src, { exclude: ['tests/**/*'] });
output = babel(output, {
  modules: 'common'
});
var output = browserify(output, {
  entries: [ './index.js' ],
  outputFile: 'output.js'
});

if (env !== 'production') {
  outputTrees.push(js);
  outputTrees.push(tests);
}
outputTrees.push(output);

module.exports = new MergeTrees(outputTrees);
