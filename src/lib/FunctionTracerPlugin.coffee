# TODO This code need rework to fit again in the GraphPaper class

###
functionPlotter = null

plotFunctionVertex: (data) =>
  for elem in data  # Correction de la position en x, y selon le nouveau système de coordonnées
    elem.realX = elem.x
    elem.realY = elem.y
    elem.x = @truncateFloat(origin.x + elem.x * gridSize)
    elem.y = @truncateFloat(origin.y - elem.y * gridSize)

  lastFunction = functionPlotter.append('g').attr("class", "function")

  @drawFunctionLines(data, lastFunction)
  @drawFunctionVertex(data, lastFunction)


drawFunctionLines: (data, group) =>
  line = d3.svg.line()
    .x((d) -> return d.x)
    .y((d) -> return d.y)
    .interpolate("basis")

  group.data(data)
    .append("path")
    .attr("d", line(data))


drawFunctionVertex: (data, group) =>
  if showVertexOn == true
    data = data.filter(@filterXInteger)

    group.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) -> return d.x)
      .attr("cy", (d) -> return d.y)
      .attr("r", vertexSize)
      .on("mousemove", @showVertexCoordinates)
      .on("mouseout", @hideVertexCoordinates)


showVertexCoordinates: (vertex) =>
  xValue = Math.round(vertex.realX * 10) / 10
  yValue = Math.round(vertex.realY * 10) / 10
  coordinates = "(#{xValue}, #{yValue})"

  parentNode = node.parentNode
  d3.select(parentNode).selectAll(".vertex-pointer-coordinates").remove()
  d3.select(parentNode).append('text')
    .attr("class", "vertex-pointer-coordinates")
    .attr("x", d3.mouse(node)[0] + 5)
    .attr("y", d3.mouse(node)[1] - 10)
    .text(coordinates)


hideVertexCoordinates: (vertex) =>
  d3.select(node.parentNode).selectAll(".vertex-pointer-coordinates").remove()


filterXInteger: (element) =>
  value = Math.abs(element.realX) % 1
  if (0.999 < value  < 1) or (0 < value < 0.00001)  # Varie en fonction de la précision de la fonction tracé
  return true
return false


###