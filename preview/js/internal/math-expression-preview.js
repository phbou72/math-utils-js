$(document).ready(function () {

  $(".math-expression").each(function () {
    try {
      var result = EquationEvaluator.parse($(this).html());
      var laTex = EquationToLaTex.parse($(this).html());
    } catch (error) {
      console.log($(this).html() + error);
    }

    $(this).next("td.expression-result").html(result);
    $(this).next("td").next(".latex-result").html(laTex);
    $(this).next("td").next("td").next(".math-jax-result").html("$$" + laTex + "$$");
  });

  $(".math-expression2").each(function () {
    try {
      var laTex2 = EquationToLaTex.parse($(this).text());
    } catch (error) {
      console.log($(this).html() + error);
    }

    $(this).next(".latex-result2").text(laTex2);
    $(this).next("td").next(".math-jax-result2").text("$$ " + laTex2 + " $$");
  });
});