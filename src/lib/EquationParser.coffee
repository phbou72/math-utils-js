
class MathUtils.EquationParser 

  events: {}

  evaluate: (expression) ->

    if expression != undefined
      index = expression.indexOf(".")

    try
      return EquationEvaluator.parse expression
    catch str
      return ""


  convertToLaTex: (expression) ->

    try
      if expression.length > 0
        return "$$ " + EquationToLaTex.parse(expression) + " $$"
      else
        return "" + expression
    catch str
      return expression


  formatNumber: (number) ->

    if number.length == 0
      return ""

    if number.indexOf("e") != -1
      return @truncateExponential number

    if number.length > 10
      if number.indexOf(".") == -1
        return @truncateInteger number
      else
        return @truncateFloat number
    else
      return number


  truncateInteger: (str) ->

    firstDigit = str.charAt(0)
    secondPart = str.substr(1, 9)

    return firstDigit + "." + secondPart + "*10^" + str.length


  truncateFloat: (str) ->

    dotPos = str.indexOf(".")
    firstPart = str.substring(0, dotPos)

    if firstPart.length >= 10
      return @truncateInteger str
    else
      nbDigitsToKeep = 10 - firstPart.length
      return firstPart + "." + str.substr(dotPos + 1, nbDigitsToKeep)


  truncateExponential: (str) ->

    ePos = str.indexOf("e")
    eSign = str.charAt(ePos + 1)
    firstPart = str.substr(0, 11)

    if eSign == "-"
      return firstPart + "*10^" + str.substr(ePos + 1, 3)
    else
      return firstPart + "*10^" + str.substr(ePos + 2, 2)
