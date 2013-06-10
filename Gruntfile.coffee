##
# To run the following :
# 1. Install node.js (http://nodejs.org/) if not already installed
# 2. Install grunt cli : npm install -g grunt-cli
# In root folder of this project
# 3. Install project dependencies : npm install
# 4. Run Grunt : grunt
#
# The default task will concatenate and minify all js of 
# this project and output them in ./build
#
module.exports = (grunt) ->

  # Project configuration.
  grunt.initConfig
    pkg: '<json:package.json>'

    jison:
      js:
        type: 'commonjs'
        files:
          'build/EquationEvaluator.js' : 'jison/EquationEvaluator.jison'
          'build/EquationToLaTex.js' : 'jison/EquationToLaTex.jison'

    coffee:
      compile:
        files:
          'build/math.utils.classes.js': [
            'src/Loader.coffee' # Must be first in the file list
            'src/**/*.coffee'
          ]

    uglify:
      internal:
        src: ['build/math.utils.classes.js', 'build/EquationEvaluator.js', 'build/EquationToLaTex.js']
        dest: 'build/math.utils.min.js'


    clean: ["build/EquationEvaluator.js", "build/EquationToLaTex.js"]

  grunt.loadTasks 'tasks'

  grunt.registerTask 'watch', ->
    done = grunt.task.current.async()
    child = grunt.util.spawn {cmd: './node_modules/.bin/coffee', args: ['-o', './build', '-c', '--watch', './src']}
    child.stdout.pipe(process.stdout)
    child.stderr.pipe(process.stderr)

  grunt.registerTask 'watch-test', ->
    done = grunt.task.current.async()
    child = grunt.util.spawn {cmd: './node_modules/.bin/mocha', args: ['--compilers', 'coffee:coffee-script', '-w', '--recursive']}
    child.stdout.pipe(process.stdout)
    child.stderr.pipe(process.stderr)

  grunt.registerTask 'default', ['jison', 'coffee', 'uglify']

  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
