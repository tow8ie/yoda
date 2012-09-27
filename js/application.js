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

  var runningInBrowser = function () {
    return (typeof window !== 'undefined');
  };

  if (runningInBrowser()) {

    YUI(config).use(modulesToLoad);

  } else {

    exports.config = config;
    exports.modulesToLoad = modulesToLoad;

  }

})(typeof exports === 'undefined' ? window : exports);

