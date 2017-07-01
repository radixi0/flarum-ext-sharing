var gulp = require('flarum-gulp');

gulp({
  modules: {
    'radixi0/sharing': [
      '../lib/**/*.js',
      'src/**/*.js'
    ]
  }
});
