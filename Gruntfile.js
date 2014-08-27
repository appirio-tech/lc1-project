'use strict';

var paths = {
  js: ['*.js', 'test/**/*.js', '!test/coverage/**', '!bower_components/**', 'packages/**/*.js', '!packages/**/node_modules/**'],
  html: ['packages/**/public/**/views/**', 'packages/**/server/views/**'],
  css: ['!bower_components/**', 'packages/**/public/**/css/*.css']
};

module.exports = function(grunt) {
  var databaseUrl;

  if (process.env.NODE_ENV !== 'production') {
    require('time-grunt')(grunt);
    var envConfig = require('./config/env/' + (process.env.NODE_ENV || 'local'));
    databaseUrl = 'postgres://' + envConfig.pg.username + ':' + envConfig.pg.password + '@' + envConfig.pg.host + ':5432/' + envConfig.pg.database;
  } else {
    databaseUrl = process.env.DATABASE_URL;
  }


  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    assets: grunt.file.readJSON('config/assets.json'),
    clean: ['bower_components/build'],
    watch: {
      js: {
        files: paths.js,
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      html: {
        files: paths.html,
        options: {
          livereload: true,
          interval: 500
        }
      },
      css: {
        files: paths.css,
        tasks: ['csslint'],
        options: {
          livereload: true
        }
      }
    },
    jshint: {
      all: {
        src: paths.js,
        options: {
          jshintrc: true
        }
      }
    },
    uglify: {
      core: {
        options: {
          mangle: false
        },
        files: '<%= assets.core.js %>'
      }
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      src: paths.css
    },
    cssmin: {
      core: {
        files: '<%= assets.core.css %>'
      }
    },
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          args: [],
          ignore: ['node_modules/**'],
          ext: 'js,html',
          nodeArgs: ['--debug'],
          delayTime: 1,
          cwd: __dirname
        }
      }
    },
    concurrent: {
      tasks: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },
    mochaTest: {
      options: {
        reporter: 'spec',
        require: [
          'server.js',
          function() {
            require('meanio/lib/util').preload(__dirname + '/packages/**/server', 'model');
          }
        ]
      },
      src: ['packages/**/server/tests/**/*.js']
    },
    migrate: {
      options: {
        env: {
          DATABASE_URL: databaseUrl   // the databaseUrl is resolved at the beginning based on the NODE_ENV, this value injects the config in the database.json
        },
        'migrations-dir': 'docs/schema/migrations', // defines the dir for the migration scripts
        verbose: true   // tell me more stuff
      }
    },
    env: {
      test: {
        NODE_ENV: 'test'
      },
      local: {
        NODE_ENV: 'local'
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    }
  });

  //Load NPM tasks
  require('load-grunt-tasks')(grunt);

  //Default task(s).
  if (process.env.NODE_ENV === 'production') {
    grunt.registerTask('default', ['clean', 'cssmin', 'uglify', 'concurrent']);
  } else {
    grunt.registerTask('default', ['clean', 'jshint', 'csslint', 'concurrent']);
  }

  // db migrate
  grunt.registerTask('dbmigrate', 'db up all the appliable scripts', function () {
    grunt.task.run('migrate:up');
  });

  grunt.registerTask('local', ['env:local', 'dbmigrate', 'clean', 'jshint', 'csslint', 'concurrent']);

  //Test task.
  grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);

  // For Heroku users only.
  // Docs: https://github.com/linnovate/mean/wiki/Deploying-on-Heroku
  grunt.registerTask('heroku:production', ['cssmin', 'uglify']);
};
