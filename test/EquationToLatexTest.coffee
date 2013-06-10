assert = require("assert")
should = require("should")

equaToLatex = require("../build/EquationToLaTex.js")

describe 'EquationToLatex', ->

  describe '#parse(constant) ', ->

    it 'should parse integer', ->
      equaToLatex.parse("2").should.equal "2"

    it 'should parse float', ->
      equaToLatex.parse("2.22").should.equal "2.22"

    #it 'should parse float with exponential form', ->
    #  equaSolver.parse("2.22e[+-]10").should.equal 2.22

    it 'should parse negative number', ->
      equaToLatex.parse("-2").should.equal "-2"

    it 'should parse E', ->
      equaToLatex.parse("E").should.equal "E"

    it 'should parse percentage', ->
      equaToLatex.parse("2 %").should.equal "2\\%"

    it 'should parse negative percentage', ->
      equaToLatex.parse("-2 %").should.equal "-2\\%"


  describe '#parse(additive expression) ', ->

    it 'should be able to do addition', ->
      equaToLatex.parse("2 + 2").should.equal "2+2"

    it 'sould be able to do substraction', ->
      equaToLatex.parse("3 - 2").should.equal "3-2"

    it 'should be able to add three value together', ->
      equaToLatex.parse("2 + 2 + 2").should.equal "2+2+2"

    it 'should be able to substract three value together', ->
      equaToLatex.parse("2 - 2 - 2").should.equal "2-2-2"


  describe '#parse(multiplicative expression) ', ->

    it 'should be able to do multiplication', ->
      equaToLatex.parse("3 * 2").should.equal "3\\times 2"

    it 'should be able to divide', ->
      equaToLatex.parse("4 / 2").should.equal "\\frac{4}{2}"

    it 'should be able to multiply three value together', ->
      equaToLatex.parse("3 * 2 * 2").should.equal "3\\times 2\\times 2"

    it 'should be able to divide three value together', ->
      equaToLatex.parse("6 / 2 / 3").should.equal "\\frac{\\frac{6}{2}}{3}"

    it 'should be able to add two multiplication together', ->
      equaToLatex.parse("2*2 + 2*2").should.equal "2\\times 2+2\\times 2"

    it 'should be able to add 1 multiplication to two value ', ->
      equaToLatex.parse("2 + 2*2 + 2").should.equal "2+2\\times 2+2"

    it 'should respect multiplication precedance from left side with addition', ->
      equaToLatex.parse("6 * 2 + 3").should.equal "6\\times 2+3"

    it 'should respect multiplication precedance from right side with addition', ->
      equaToLatex.parse("6 + 2 * 3").should.equal "6+2\\times 3"

    it 'should respect multiplication precedance from right side width substraction', ->
      equaToLatex.parse("6 - 2 * 3").should.equal "6-2\\times 3"


  describe '#parse(function)', ->

    it 'should be able to do square root', ->
      equaToLatex.parse("sqrt(4)").should.equal "\\sqrt{4}"

    it 'should be able to do other form of square root', ->
      equaToLatex.parse("(1/2)sqrt(4)").should.equal "(\\frac{1}{2})\\sqrt{4}"

    it 'should be able to do square root in french', ->
      equaToLatex.parse("racine de(4)").should.equal "\\sqrt{4}"

    it 'should be able to use the absolute function', ->
      equaToLatex.parse("abs(-1.22)").should.equal "\\left|-1.22\\right|"

    it 'should be able to use the log function', ->
      equaToLatex.parse("log(2)").should.equal "\\log (2)"

    it 'should be able to use the ln function', ->
      equaToLatex.parse("ln(2)").should.equal "\\ln (2)"

    it 'should be able to use the sin function', ->
      equaToLatex.parse("sin(-4)").should.equal "\\sin (-4)"

    it 'should be able to use the cos function', ->
      equaToLatex.parse("cos(-4)").should.equal "\\cos (-4)"

    it 'should be able to use the arcsin function', ->
      equaToLatex.parse("tan(-4)").should.equal "\\tan (-4)"

    it 'should be able to use the arcsin function', ->
      equaToLatex.parse("arcsin(-1)").should.equal "\\arcsin (-1)"

    it 'should be able to use the arccos function', ->
      equaToLatex.parse("arccos(-1)").should.equal "\\arccos (-1)"

    it 'should be able to use the arctan function', ->
      equaToLatex.parse("arctan(-2)").should.equal "\\arctan (-2)"

    it 'should be able to multiply a scalar with a function', ->
      equaToLatex.parse("2*sqrt(4)").should.equal "2\\times \\sqrt{4}"

    it 'should be able to multiply a scalar with a function without the multiplication operator', ->
      equaToLatex.parse("2 sqrt(4)").should.equal "2\\sqrt{4}"

    #it 'should be able to multiply a scalar with a function without the multiplication operator and space', ->   # Pas supporté mais ça serait l'idéal
    #  equaToLatex.parse("2sqrt(4)").should.equal "2\\sqrt{4}"

    it 'should be able to multiply two function together', ->
      equaToLatex.parse("log(2) * sqrt(4)").should.equal "\\log (2)\\times \\sqrt{4}"

    it 'should evaluate expression inside parenthesis before evaluating function', ->
      equaToLatex.parse("sqrt(2 + 2)").should.equal "\\sqrt{2+2}"

    it 'should multiply two function togerther', ->
      equaToLatex.parse("sqrt(4) sqrt(4)").should.equal "\\sqrt{4}\\sqrt{4}"

    it 'should multiply multiple function togerther', ->
      equaToLatex.parse("sqrt(4) sqrt(4) sqrt(4)").should.equal "\\sqrt{4}\\sqrt{4}\\sqrt{4}"


  describe '#parse(exponent expression) ', ->

    it 'should be able to parse exposant', ->
      equaToLatex.parse("2^(2)").should.equal "2^{2}"

    it 'should support superscript exposant', ->
      equaToLatex.parse("2³").should.equal "2^{3}"

    it 'should support multiple superscript exposant', ->
      equaToLatex.parse("2¹⁰").should.equal "2^{10}"

    it 'should support e^x exponential form', ->
      equaToLatex.parse("e^(0)").should.equal "e^{0}"

    it 'should evaluate exposant indice before evaluating exponent', ->
      equaToLatex.parse("2^(2 + 2)").should.equal "2^{2+2}"

    it 'should evaluate exposant base before evaluating exponent', ->
      equaToLatex.parse("(2 + 2)^(2)").should.equal "(2+2)^{2}"

    it 'should evaluate exposant base before evaluating exponent', ->
      equaToLatex.parse("(1 + 1)^(1 + 1)").should.equal "(1+1)^{1+1}"

    it 'should be able to multiply a pair of parenthesis with its own value', ->
      equaToLatex.parse("(4) * 2^(2)").should.equal "(4)\\times 2^{2}"

    it 'should be able to multiply a pair of parenthesis with its own value even if its on the other side', ->
      equaToLatex.parse("2^(2)(4)").should.equal "2^{2}(4)"

    it 'should evaluate nested exponent', ->
      equaToLatex.parse("2^(2^(2))").should.equal "2^{2^{2}}"


  describe '#parse(factorial)', ->

    it 'should be able to do factorial', ->
      equaToLatex.parse("4!").should.equal "4!"

    it 'should be able to do an addition and a factorial', ->
      equaToLatex.parse("4 + 4!").should.equal "4+4!"

    it 'should be able to multiply two factorial', ->
      equaToLatex.parse("3! * 2!").should.equal "3!\\times 2!"

    #it 'should be able to multiply two factorial without the multiplication operator', ->
    #  equaToLatex.parse("3!2!").should.equal "3!2!"

    #it 'should be able to multiply multiple factorial', ->
    #  equaToLatex.parse("3!2!4!").should.equal "3!2!4!"

    it 'should multiply a scalar with a factorial', ->
      equaToLatex.parse("2 * 2!").should.equal "2\\times 2!"

    it 'should evaluate expression inside parenthesis before applying factorial', ->
      equaToLatex.parse("(2 + 2)!").should.equal "(2+2)!"


  describe '#parse(parenthesis)', ->

    it 'should evaluate value inside parenthesis', ->
      equaToLatex.parse("(2)").should.equal "(2)"

    it 'should evaluate nested parenthesis', ->
      equaToLatex.parse("((2))").should.equal "((2))"

    it 'should multiply a scalar with the inside of a pair of parenthesis', ->
      equaToLatex.parse("2(2)").should.equal "2(2)"

    it 'should be able to multiply the value inside two pair of parenthesis', ->
      equaToLatex.parse("(2)(3)").should.equal "(2)(3)"

    it 'should be able to multiply the value inside multiple group of parenthesis', ->
      equaToLatex.parse("(2)(3)(4)").should.equal "(2)(3)(4)"

    it 'should respect parenthesis order', ->
      equaToLatex.parse("2 * (2 + 2)").should.equal "2\\times (2+2)"


  describe '#parse(variables) ', ->

    it 'should support variables', ->
      equaToLatex.parse("a").should.equal "a"

    it 'should support variables index', ->
      equaToLatex.parse("a1").should.equal "a1" #TODO implanter la notation LaTex
      equaToLatex.parse("a12").should.equal "a12" #TODO implanter la notation LaTex


    it 'should parse grec letters', ->
      letters = [
        "alpha", "beta", "gamma", "delta", "epsilon", "zeta", "eta", "Delta", "Theta", "theta",
        "iota", "kappa", "lambda", "mu", "nu", "xi", "Lambda", "Xi", "Pi", "pi", "rho", "sigma",
        "tau", "Sigma", "Upsilon", "Phi", "upsilon", "phi", "chi", "psi", "omega","Psi","Omega"
      ]

      actual = expected = ""
      for letter in letters
        actual += "#{letter} + "
        expected += "\\#{ letter }+"

      actual = actual.substring(0, actual.length - 3)
      expected = expected.substring(0, expected.length - 1)

      equaToLatex.parse(actual).should.equal expected


  describe '#parse(logical operators) ', ->

    it 'should parse logical operators', ->
      equaToLatex.parse("1 = a").should.equal "1=a"
      equaToLatex.parse("1 != a").should.equal "1\\neq a"
      equaToLatex.parse("1 not equal a").should.equal "1\\neq a"
      equaToLatex.parse("1 n'égal pas a").should.equal "1\\neq a"
      equaToLatex.parse("1 >= a").should.equal "1\\geq a"
      equaToLatex.parse("1 <= a").should.equal "1\\leq a"
      equaToLatex.parse("1 < a").should.equal "1<a"
      equaToLatex.parse("1 > a").should.equal "1>a"