assert = require("assert")
should = require("should")

evaluator = require("../build/lib/math.utils.equation.evaluator.js")

describe 'EquationSolver', ->

  describe '#parse(constant) ', ->

    it 'should parse integer', ->
      evaluator.parse("2").should.equal 2

    it 'should parse float', ->
      evaluator.parse("2.22").should.equal 2.22

    #it 'should parse float with exponential form', ->
    #  evaluator.parse("2.22e[+-]10").should.equal 2.22

    it 'should parse pi', ->
      evaluator.parse("pi").should.equal Math.PI

    it 'should parse PI', ->
      evaluator.parse("PI").should.equal Math.PI

    it 'should parse e', ->
      evaluator.parse("e").should.equal Math.E

    it 'should parse E', ->
      evaluator.parse("E").should.equal Math.E

    it 'should parse negative number', ->
      evaluator.parse("-2").should.equal -2

    it 'should parse percentage', ->
      evaluator.parse("2 %").should.equal 0.02

    it 'should parse negative percentage', ->
      evaluator.parse("-2 %").should.equal -0.02


  describe '#parse(additive expression) ', ->

    it 'should be able to do addition', ->
      evaluator.parse("2 + 2").should.equal 4

    it 'sould be able to do substraction', ->
      evaluator.parse("3 - 2").should.equal 1

    it 'should be able to add three value together', ->
      evaluator.parse("2 + 2 + 2").should.equal 6

    it 'should be able to substract three value together', ->
      evaluator.parse("2 - 2 - 2").should.equal -2


  describe '#parse(multiplicative expression) ', ->

    it 'should be able to do multiplication', ->
      evaluator.parse("3 * 2").should.equal 6

    it 'should be able to divide', ->
      evaluator.parse("4 / 2").should.equal 2

    it 'should be able to multiply three value together', ->
      evaluator.parse("3 * 2 * 2").should.equal 12

    it 'should be able to divide three value together', ->
      evaluator.parse("6 / 2 / 3").should.equal 1

    it 'should be able to add two multiplication together', ->
      evaluator.parse("2*2 + 2*2").should.equal 8

    it 'should be able to add 1 multiplication to two value ', ->
      evaluator.parse("2 + 2*2 + 2").should.equal 8

    it 'should respect multiplication precedance from left side with addition', ->
      evaluator.parse("6 * 2 + 3").should.equal 15

    it 'should respect multiplication precedance from right side with addition', ->
      evaluator.parse("6 + 2 * 3").should.equal 12

    it 'should respect multiplication precedance from right side width substraction', ->
      evaluator.parse("6 - 2 * 3").should.equal 0


  describe '#parse(function)', ->

    it 'should be able to do square root', ->
      evaluator.parse("sqrt(4)").should.equal Math.sqrt(4)

    it 'should be able to do other form of square root', ->
      evaluator.parse("(1/2)sqrt(4)").should.equal (1/2) * Math.sqrt(4)

    it 'should be able to do square root in french', ->
      evaluator.parse("racine de(4)").should.equal Math.sqrt(4)

    it 'should be able to use the absolute function', ->
      evaluator.parse("abs(-1.22)").should.equal Math.abs(-1.22)

    it 'should be able to use the log function', ->
      evaluator.parse("log(2)").should.equal Math.log(2)

    it 'should be able to use the ln function', ->
      evaluator.parse("ln(2)").should.equal Math.log(2) / Math.log(Math.E)

    it 'should be able to use the sin function', ->
      evaluator.parse("sin(-4)").should.equal Math.sin(-4)

    it 'should be able to use the cos function', ->
      evaluator.parse("cos(-4)").should.equal Math.cos(-4)

    it 'should be able to use the arcsin function', ->
      evaluator.parse("tan(-4)").should.equal Math.tan(-4)

    it 'should be able to use the arcsin function', ->
      evaluator.parse("arcsin(-1)").should.equal Math.asin(-1)

    it 'should be able to use the arccos function', ->
      evaluator.parse("arccos(-1)").should.equal Math.acos(-1)

    it 'should be able to use the arctan function', ->
      evaluator.parse("arctan(-2)").should.equal Math.atan(-2)

    it 'should be able to multiply a scalar with a function', ->
      evaluator.parse("2*sqrt(4)").should.equal 2 * Math.sqrt(4)

    it 'should be able to multiply a scalar with a function without the multiplication operator', ->
      evaluator.parse("2 sqrt(4)").should.equal 2 * Math.sqrt(4)

    #it 'should be able to multiply a scalar with a function without the multiplication operator and space', ->   # Pas supporté mais ça serait l'idéal
    #  evaluator.parse("2sqrt(4)").should.equal 2 * Math.sqrt(4)

    it 'should be able to multiply two function together', ->
      evaluator.parse("log(2) * sqrt(4)").should.equal Math.log(2) * Math.sqrt(4)

    it 'should evaluate expression inside parenthesis before evaluating function', ->
      evaluator.parse("sqrt(2 + 2)").should.equal Math.sqrt(2 + 2)

    it 'should multiply two function togerther', ->
      evaluator.parse("sqrt(4) sqrt(4)").should.equal Math.sqrt(4) * Math.sqrt(4)

    it 'should multiply multiple function togerther', ->
      evaluator.parse("sqrt(4) sqrt(4) sqrt(4)").should.equal Math.sqrt(4) * Math.sqrt(4) * Math.sqrt(4)


  describe '#parse(exponent expression) ', ->

    it 'should be able to parse exposant', ->
      evaluator.parse("2^(2)").should.equal 4

    it 'should support superscript exposant', ->
      evaluator.parse("2³").should.equal Math.pow(2, 3)

    it 'should support multiple superscript exposant', ->
      evaluator.parse("2¹⁰").should.equal Math.pow(2, 10)

    it 'should support e^x exponential form', ->
      evaluator.parse("e^(0)").should.equal 1

    it 'should evaluate exposant indice before evaluating exponent', ->
      evaluator.parse("2^(2 + 2)").should.equal 16

    it 'should evaluate exposant base before evaluating exponent', ->
      evaluator.parse("(2 + 2)^(2)").should.equal 16

    it 'should evaluate exposant base before evaluating exponent', ->
      evaluator.parse("(1 + 1)^(1 + 1)").should.equal 4

    it 'should be able to multiply a pair of parenthesis with its own value', ->
      evaluator.parse("(4) * 2^(2)").should.equal 16

    it 'should be able to multiply a pair of parenthesis with its own value even if its on the other side', ->
      evaluator.parse("2^(2)(4)").should.equal 16

    it 'should evaluate nested exponent', ->
      evaluator.parse("2^(2^(2))").should.equal 16


  describe '#parse(factorial)', ->

    it 'should be able to do factorial', ->
      evaluator.parse("4!").should.equal 24

    it 'should be able to do an addition and a factorial', ->
      evaluator.parse("4 + 4!").should.equal 28

    it 'should be able to multiply two factorial', ->
      evaluator.parse("3! * 2!").should.equal 12

    #it 'should be able to multiply two factorial without the multiplication operator', ->
    #  evaluator.parse("3!2!").should.equal 12

    #it 'should be able to multiply multiple factorial', ->
    #  evaluator.parse("3!2!4!").should.equal 288

    it 'should multiply a scalar with a factorial', ->
      evaluator.parse("2 * 2!").should.equal 4

    it 'should evaluate expression inside parenthesis before applying factorial', ->
      evaluator.parse("(2 + 2)!").should.equal 24


  describe '#parse(parenthesis)', ->

    it 'should evaluate value inside parenthesis', ->
      evaluator.parse("(2)").should.equal 2

    it 'should evaluate nested parenthesis', ->
      evaluator.parse("((2))").should.equal 2

    it 'should multiply a scalar with the inside of a pair of parenthesis', ->
      evaluator.parse("2(2)").should.equal 4

    it 'should be able to multiply the value inside two pair of parenthesis', ->
      evaluator.parse("(2)(3)").should.equal 6

    it 'should be able to multiply the value inside multiple group of parenthesis', ->
      evaluator.parse("(2)(3)(4)").should.equal 24

    it 'should respect parenthesis order', ->
      evaluator.parse("2 * (2 + 2)").should.equal 8
