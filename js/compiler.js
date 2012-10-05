#!/usr/bin/env node

var path = require('path'),
    fs   = require('fs'),
    argv = require('optimist')
           .usage('Usage: $0 --base-dir js/ --yui-lib-dir node_modules/yui --module moduleName --output-file path/to/file.js [options]')
           .demand(['base-dir', 'yui-lib-dir', 'module', 'output-file'])
           .alias('b', 'base-dir')
           .alias('y', 'yui-lib-dir')
           .alias('m', 'module')
           .alias('o', 'output-file')
           .alias('c', 'compress')
           .describe('base-dir', 'Path to directory where the JS files can be found on disc.')
           .describe('yui-lib-dir', 'Path to the YUI library directory.')
           .describe('module', 'YUI module name (not path) of the first module to load.')
           .describe('output-file', 'Path to compiled JS file.')
           .describe('compress', 'Whether to compress the JavaScript code with UglifyJS.')
           .argv;

var baseDirPath = path.resolve(path.join('.', argv['base-dir']));
var mainFilePath = path.resolve(path.join(__dirname, 'main.js'));
var yuiLibDirPath = path.resolve(path.join('.', argv['yui-lib-dir']));
var moduleConfigFilePath = path.join(baseDirPath, 'module_config.js');
var moduleToLoad = argv.module;
var outputFilePath = path.resolve(path.join('.', argv['output-file']));
var compressionRequested = !!argv.compress;

var YUI = require('yui').YUI,
    moduleConfig = require(moduleConfigFilePath).moduleConfig;

moduleConfig = YUI().merge(moduleConfig, { base: baseDirPath + '/' })

var config = {
  base: yuiLibDirPath + '/',
  groups: {
    main: moduleConfig
  }
}

console.log('Base dir path:', baseDirPath);
console.log('Main file path: ', mainFilePath);
console.log('YUI lib dir path:', yuiLibDirPath);
console.log('Module config:', config);
console.log('Module config path:', moduleConfigFilePath);
console.log('Module to load:', moduleToLoad);
console.log('Output file path:', outputFilePath);
console.log('Compression:', compressionRequested);

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

var compile = function (modules) {
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

var patchModuleExtraction = function (YUI, modules) {
  var originalAdd = YUI.add;

  YUI.add = function (name, fn, version, details) {
    if (details) {
      dependencies = details.requires;
      dependencies.forEach(function (dependency) {
        if (modules.indexOf(dependency) == -1) {
          modules.unshift(dependency);
        }
      });
    }

    var noop = function () {};
    originalAdd.call(this, name, noop, version, details);
  }
};

modules = [];
patchModuleExtraction(YUI, modules);

YUI(config).use(moduleToLoad, function(Y) {
  compile(modules);
});

