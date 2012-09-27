#!/usr/bin/env node

var path = require('path'),
    fs   = require('fs'),
    argv = require('optimist')
           .usage('Usage: $0 --base-dir js/ --module moduleName --output-file path/to/file.js [options]')
           .demand(['base-dir', 'module', 'output-file'])
           .alias('b', 'base-dir')
           .alias('m', 'module')
           .alias('o', 'output-file')
           .alias('c', 'compress')
           .describe('base-dir', 'Path to directory where the JS files can be found on disc. ' +
                                 'This directory must also include the main.js file.')
           .describe('module', 'YUI module name (not path) of the first module to load.')
           .describe('output-file', 'Path to compiled JS file.')
           .describe('compress', 'Whether to compress the JavaScript code with UglifyJS.')
           .argv;

var baseDirPath = path.resolve(path.join('.', argv['base-dir']));
var mainFilePath = path.join(baseDirPath, 'main.js');
var moduleToLoad = argv.module;
var outputFilePath = path.resolve(path.join('.', argv['output-file']));
var compressionRequested = !!argv.compress;

console.log('Base Dir path:', baseDirPath);
console.log('Module to load:', moduleToLoad);
console.log('Output file path:', outputFilePath);
console.log('Compression:', compressionRequested);

var YUI  = require('yui').YUI,
    main = require(mainFilePath);

var config = YUI().merge(main.config, {
  base: './js/'
});

var resolveModules = function (modules) {
  var Y = YUI();

  var loader = new Y.Loader(
    YUI().merge(config, {
      ignoreRegistered: true,
      require: modules
    })
  );

  return loader.resolve(true);
};

var concatModules = function (modules, mainFilePath) {
  var str = [];

  modules.forEach(function(file) {
    str.push(fs.readFileSync(file, 'utf8'));
  });

  str.push(fs.readFileSync(mainFilePath, 'utf8'));
  return str.join('\n');
};

var compress = function (javascript) {
  var parser = require("uglify-js").parser;
  var uglify = require("uglify-js").uglify;

  var ast = parser.parse(javascript);
  ast = uglify.ast_mangle(ast);
  ast = uglify.ast_squeeze(ast);
  return uglify.gen_code(ast);
};

var compile = function (Y) {
  modules.push(moduleToLoad);
  console.log('Computed modules:', modules);

  var resolvedModules = resolveModules(modules).js;
  console.log('Resolved modules:', resolvedModules);

  var output = concatModules(resolvedModules, mainFilePath);

  if (compressionRequested) {
    output = compress(output);
  }

  fs.writeFileSync(outputFilePath, output, 'utf8');
};

modules = [];

YUI.__add__ = YUI.add;
YUI.add = function (name, fn, version, details) {
  if (details) {
    dependencies = details.requires;
    dependencies.forEach(function (dependency) {
      if (modules.indexOf(dependency) == -1) {
        modules.unshift(dependency);
      }
    });
  }
  YUI.__add__.call(this, name, function () {}, version, details);
}

YUI(config).use(moduleToLoad, compile);

