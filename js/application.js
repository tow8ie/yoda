(function (exports){

  var config = {
    base: 'js/',
    modules: {
      'a': {
        path: 'a.js'
      },
      'b': {
        path: 'b.js'
      },
      'c': {
        path: 'c.js'
      }
    }
  };

  var modulesToLoad = ['a'];

  if (typeof YUI !== 'undefined') {
    YUI(config).use(modulesToLoad);
  }

  exports.config = config;
  exports.modulesToLoad = modulesToLoad;

})(typeof exports === 'undefined' ? window : exports);

