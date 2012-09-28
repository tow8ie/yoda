(function (window){

  if (typeof console === "undefined") {
    window.console = {
      log:   function() {},
      error: function() {},
      info:  function() {},
      debug: function() {}
    }
  }

  var config = window.moduleConfig;

  if (typeof config === "undefined") {
    console.error('No global variable "moduleConfig" with module definitions found.')
    return;
  }

  var mainScriptTag = document.getElementById('main-script');
  if (mainScriptTag) {

    var moduleToLoad = mainScriptTag.getAttribute('data-main');
    if (moduleToLoad) {

      YUI(config).use(moduleToLoad);

    } else {

      console.error('The script tag with id "main-script" does not have a "data-main" attribute.' +
          ' Insert something like ' +
          '\'<script src="main.js" id="main-script" data-main="module-to-load"></script>\'.');

    }

  } else {

    console.error('No script tag found with id "main-script". ' +
        'Insert something like ' +
        '\'<script src="main.js" id="main-script" data-main="module-to-load"></script>\'.');

  }

})(window);

