var YUI = require('yui').YUI,
    path = require('path'),
    fs = require('fs'),
    application = require('./application.js');

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

var resolve_modules = function (modules) {
  var Y = YUI();

  var loader = new Y.Loader(
    YUI().merge(config, {
      ignoreRegistered: true, // Needed, don’t know why.
      require: modules
    })
  );

  return loader.resolve(true);
}

YUI(config).use(application.modulesToLoad, function (Y) {

  application.modulesToLoad.forEach(function (module) {
    modules.push(module);
  });
  console.log('Computed modules:', modules);

  var resolved_modules = resolve_modules(modules).js;
  console.log('Resolved modules:', resolved_modules);

  var str = [];

  resolved_modules.forEach(function(file) {
    str.push(fs.readFileSync(file, 'utf8'));
  });
    
  str.push(fs.readFileSync('./js/application.js', 'utf8'));

  fs.writeFileSync('./js/application-compiled.js', str.join('\n'), 'utf8');

});

