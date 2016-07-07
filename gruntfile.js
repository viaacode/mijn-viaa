
var grunt = require("grunt");  
  grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  sass: {
      dist: {
       src: [
         'scss/_styles.scss',
       ],
       dest: 'dist/styles.css',
     }
  },
  copy: {
    main: {
      files: [
        // includes files within path
        {expand: false, src: ['node_modules/basscss/css/basscss.css'], dest: 'scss/_basscss.scss', filter: 'isFile'},
        {expand: false, src: ['node_modules/vue/dist/vue.min.js'], dest: 'dist/vue.js', filter: 'isFile'},
        {expand: false, src: ['node_modules/jquery/dist/jquery.min.js'], dest: 'dist/jquery.js', filter: 'isFile'},
      ],
    },
  },  
  jshint: {
    all: ['js/*.js']
  },
  concat: {
    options: {
      // define a string to put between each file in the concatenated output
      //separator: ';'
    },
    dist: {
      // the files to concatenate
      src: ['js/**/*.js'],
      // the location of the resulting JS file
      dest: 'dist/scripts.js'
    }
  },
  watch: {
    css: {
      files: '**/*.scss',
      tasks: ['sass']
    }
  }
});
grunt.loadNpmTasks('grunt-contrib-sass');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.registerTask('default',['copy', 'sass', 'jshint', 'concat']);


