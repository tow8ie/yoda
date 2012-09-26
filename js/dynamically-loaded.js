YUI({
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
}).use('a', function (Y) {
  console.log('Bootstrap code.')
});

