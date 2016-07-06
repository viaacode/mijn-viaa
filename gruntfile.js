
var grunt = require("grunt");  
  grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  sass: {
      dist: {
       src: [
         'scss/styles.scss',
       ],
       dest: 'dist/styles.css',
     }
  },
  copy: {
    main: {
      files: [
        // includes files within path
        {expand: false, src: ['node_modules/basscss/css/basscss.css'], dest: 'scss/basscss.scss', filter: 'isFile'},
        {expand: false, src: ['node_modules/vue/dist/vue.min.js'], dest: 'dist/vue.js', filter: 'isFile'},
      ],
    },
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
grunt.registerTask('default',['copy', 'sass', 'watch']);
