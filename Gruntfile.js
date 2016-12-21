module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-qunit-istanbul');

  grunt.initConfig({
    qunit: {
      options: {
        '--web-security': 'no',
        coverage: {
          disposeCollector: true,
          src: ['js/**/*.js'],
          instrumentedFiles: 'tmp/',
          htmlReport: 'report/coverage',
          coberturaReport: 'report/',
          linesThresholdPct: 10,
          reportOnFail: true
        }
      },
      all: ['test/index.html']
    },
  });

  grunt.registerTask('test', ['qunit']);
  grunt.registerTask('default', ['test']);
};
