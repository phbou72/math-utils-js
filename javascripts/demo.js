$(document).ready(function () {
  
  // Create an EquationParser
  var parser = new MathUtils.EquationParser();


  // Then Evaluate an expression
  var mathExpression = $("#math-expression");
  var mathExpressionResult = $("#math-expression-result");

  var result = parser.evaluate(mathExpression.html());
  mathExpressionResult.html(result);


  // Convert an expression to LaTex
  var mathExpression2 = $("#math-expression2");
  var mathExpressionLatex = $("#math-expression-latex");
  var mathExpressionMathJax = $("#math-expression-mathjax");
  
  var latexCode = parser.convertToLaTex(mathExpression2.html());
  mathExpressionLatex.html(latexCode);
  mathExpressionMathJax.html("$$" + latexCode + "$$");


  // Display a graph paper
  var graphPaper = new MathUtils.GraphPaper("#graph-paper");

  var shapes = {
    vertexs: [{x:3, y:3}, {x:1, y:2}],
    lines: [[{x:1, y:1}, {x:2, y:4}],[{x:2, y:2}, {x:3, y:0}]],
    polygons: [[{x:5, y:1}, {x:5, y:3}, {x:7, y:3}, {x:7, y:1}]]
  }

  graphPaper.addShapes(shapes)

  // Highlight javascript code!
  SyntaxHighlighter.all(); 

});
