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

  var isBrowser = function () {
    return !!(typeof window !== 'undefined' && navigator && document);
  };

  if (isBrowser()) {

    YUI(config).use(modulesToLoad);

  } else {

    exports.config = config;
    exports.modulesToLoad = modulesToLoad;

  }

})(typeof exports === 'undefined' ? window : exports);

