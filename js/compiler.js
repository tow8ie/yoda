#!/usr/bin/env node

var YUI = require('yui').YUI,
    path = require('path'),
    fs = require('fs'),
    application = require('./main.js');

var argumentList = process.argv.splice(2);

if (argumentList.length !== 1) {
  console.log('Usage: compiler.js moduleName')
  process.exit(1);
}

var moduleToLoad = argumentList[0];

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
      ignoreRegistered: true, // Needed, don’t know why.
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
    
  str.push(fs.readFileSync('./js/main.js', 'utf8'));

  fs.writeFileSync('./js/main-compiled.js', str.join('\n'), 'utf8');

});

