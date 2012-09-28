(function(world) {
  world.moduleConfig = {
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
})(typeof exports === "undefined" ? window : exports);
