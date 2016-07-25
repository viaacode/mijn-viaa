
var grunt = require("grunt");  
  grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  sass: {
      dist: {
       src: [
         'scss/styles.scss',
       ],
       dest: 'public/css/styles.css',
     }
  },
  copy: {
    main: {
      files: [
        {expand: false, src: ['node_modules/basscss/css/basscss.css'], dest: 'scss/_basscss.scss', filter: 'isFile'},
        {expand: false, src: ['node_modules/vue/dist/vue.js'], dest: 'public/js/vue.js', filter: 'isFile'},
        {expand: false, src: ['node_modules/chart.js/dist/Chart.js'], dest: 'public/js/chart.js', filter: 'isFile'},
        {expand: false, src: ['node_modules/moment/min/moment.min.js'], dest: 'public/js/moment.js', filter: 'isFile'},

        {expand: true, cwd:'js', src: '**/*', dest: 'public/js'},
        {expand: true, cwd:'assets', src: '**/*', dest: 'public/assets'},
        {expand: true, cwd:'fonts', src: '**/*', dest: 'public/fonts'},

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
      src: ['js/concat/*.js'],
      // the location of the resulting JS file
      dest: 'dist/scripts.js'
    }
  },
  watch: {
    css: {
      files: '**/*.scss',
      tasks: ['sass']
    },
    scripts: {
        files: 'js/*.js',
        tasks: ['jshint', 'copy']
    }
  }
});

grunt.loadNpmTasks('grunt-contrib-sass');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.registerTask('default',['copy', 'sass', 'jshint']);


