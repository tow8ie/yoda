#!/usr/bin/env node

var YUI = require('yui').YUI,
    path = require('path'),
    fs = require('fs'),
    application = require('./main.js');

var argv = require('optimist')
           .usage('Usage: $0 --base-dir js/ --module moduleName --output-file path/to/file.js')
           .demand(['base-dir', 'module', 'output-file'])
           .alias('b', 'base-dir')
           .alias('m', 'module')
           .alias('o', 'output-file')
           .describe('base-dir', 'Path to directory where the JS files can be found on disc. ' +
                                 'This directory must also include the main.js file.')
           .describe('module', 'YUI module name (not path) of the first module to load')
           .describe('output-file', 'Path to compiled JS file')
           .argv;

var baseDirPath = path.resolve(path.join('.', argv['base-dir']));
var moduleToLoad = argv.module;
var outputFilePath = path.resolve(path.join('.', argv['output-file']));

console.log('Base Dir path:', baseDirPath);
console.log('Module to load:', moduleToLoad);
console.log('Output file path:', outputFilePath);

var config = YUI().merge(application.config, {
  base: './js/'
});

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

var resolveModules = function (modules) {
  var Y = YUI();

  var loader = new Y.Loader(
    YUI().merge(config, {
      ignoreRegistered: true,
      require: modules
    })
  );

  return loader.resolve(true);
}

YUI(config).use(moduleToLoad, function (Y) {

  modules.push(moduleToLoad);
  console.log('Computed modules:', modules);

  var resolvedModules = resolveModules(modules).js;
  console.log('Resolved modules:', resolvedModules);

  var str = [];

  resolvedModules.forEach(function(file) {
    str.push(fs.readFileSync(file, 'utf8'));
  });
    
  var mainFilePath = path.join(baseDirPath, 'main.js');
  str.push(fs.readFileSync(mainFilePath, 'utf8'));

  fs.writeFileSync(outputFilePath, str.join('\n'), 'utf8');

});

