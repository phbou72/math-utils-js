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

  grunt.initConfig
    pkg: '<json:package.json>'

    clean: ["build"]

    jison:
      js:
        type: 'commonjs'
        files:
          'build/lib/math.utils.equation.evaluator.js' : 'jison/EquationEvaluator.jison'
          'build/lib/math.utils.equation.tolatex.js' : 'jison/EquationToLaTex.jison'

    coffee:
      app:
        files: [
          expand: true
          cwd: "./src"
          src: ["**/*.coffee"]
          dest: "./build"
          ext: ".js"       
        ]

    concat: 
      dist:
        src: ['build/lib/Namespace.js'
         'build/lib/**/*.js', ]
        dest: 'lib/math.utils.js'

    uglify:
      internal:
        src: ['lib/math.utils.js']
        dest: 'lib/math.utils.min.js'

    watch:
      app:
        files: ['src/**/*.coffee']
        tasks: ['coffee']

  grunt.loadTasks 'tasks'

  grunt.registerTask 'watch-test', ->
    done = grunt.task.current.async()
    child = grunt.util.spawn {cmd: './node_modules/.bin/mocha', args: ['--compilers', 'coffee:coffee-script', '-w', '--recursive']}
    child.stdout.pipe(process.stdout)
    child.stderr.pipe(process.stderr)

  grunt.registerTask 'default', ['clean', 'jison', 'coffee', 'concat', 'uglify']

  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
