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

  var isBrowser = function () {
    return !!(typeof window !== 'undefined' && navigator && document);
  };

  var log = function (message) {
    if (typeof console !== 'undefined') {
      console.log(message);
    }
  };

  if (isBrowser()) {

    var mainScriptTag = document.getElementById('main-script');

    if (mainScriptTag) {

      var moduleToLoad = mainScriptTag.getAttribute('data-main');
      if (moduleToLoad) {

        YUI(config).use(moduleToLoad);

      } else {

        log('The script tag with id "main-script" does not have a "data-main" attribute.' +
            ' Insert something like ' +
            '\'<script src="main.js" id="main-script" data-main="module-to-load"></script>\'.');

      }

    } else {

      log('No script tag found with id "main-script". ' +
          'Insert something like ' +
          '\'<script src="main.js" id="main-script" data-main="module-to-load"></script>\'.');

    }

  } else {

    exports.config = config;

  }

})(typeof exports === 'undefined' ? window : exports);

