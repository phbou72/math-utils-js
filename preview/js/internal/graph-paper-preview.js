$(document).ready(function () {
  var graph = new MathUtils.GraphPaper("#graph-paper");

  graph.addShapes(
    {
      lines: [[{x:1, y:1}, {x:3, y:3}],[{x:2, y:2}, {x:3, y:0}]],
      polygons: [[{x:4, y:4}, {x:4, y:6}, {x:6, y:6}, {x:6, y:4}]],
      vertexs: [{x:4, y:2}, {x:1, y:2}]
    }
  )
});
