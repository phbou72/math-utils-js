class MathUtils.GraphPaper

  width = 400
  height = 300
  gridSize = 50
  vertexSize = 8
  origin = {x: 0, y: 0}
  space = 5
  svg = null
  node = null
  grid = null
  axis = null
  axisNumbers = null

  isDoubleClick = no
  doubleClickTimer = null

  linesTracer = null
  linesVertexs = [[]]
  lastLineIndex = 0;
  lastLine = null


  draggingVertex = no
  draggedVertex = null
  draggedVertexId = - 1

  draggingPath = no
  draggedPath = null
  draggedPathId = - 1
  lastMousePosition = null

  # Pointer
  vertexPointer = null
  vertexCoordinates = null
  linePointer = null
  polygonPointer = null

  drawModes = ["free", "snapToGrid", "snapToIntersection"]
  currentDrawMode = "snapToIntersection"

  tools = ["move", "delete", "vertex", "line", "polygon"]
  currentTool = "move"

  registeredEvent = []

  initialPathEditable = true

  #Add Vertex Handle
  hideAddVertexHandleTimer = null


  constructor: (selector, width, height) ->

    svg = d3.select(selector)

    parent = svg.node().parentNode.getBoundingClientRect()
    width = parent.width
    height = parent.height
    origin = { x: gridSize, y: height - gridSize }

    svg = svg.append('g')
    node = svg.node()

    # Adding graphics elements of the Graph Paper
    svg.append('rect')
      .attr("class", "background")
      .attr("width", width * space)
      .attr("height", height * space)
      .attr("x", - 1 * width * space / 2)

    grid = svg.append('g').attr("class", "grid")
    axis = svg.append('g').attr("class", "axis")
    axisNumbers = svg.append("g").attr("class", "axis-numbers")

    @addGrid()
    @addAxis()
    @addNumbersToAxis()

    # Trace lines plugin
    linesTracer = svg.append("g").attr("class", "line-tracer")

    @initToolsButton()
    d3.select(".added").on("click", =>
      console.log @getAddedShapes()
    )


## Tools binding wit UI

  initToolsButton: =>
    _.each tools, (tool) =>
      button = d3.select(node.parentNode.parentNode).select("." + tool)[0][0] # TODO Bug with IE? d3.select(handle.parentNode)[0][0].parentElement

      if tool is currentTool 
        d3.select(button).classed("active", "active")

      d3.select(button).on("click", (element, id) =>
        @switchToTool(tool)
      )


  switchToTool: (toolName) =>
    @hideCurrentTool()
    currentTool = toolName
    @showCurrentTool()


  hideCurrentTool: =>
    switch currentTool
      when "move" then return null
      when "delete" then return null

      when "vertex"
        @hideVertexPointer()
        @hideVertexCoordinates()

      when "line"
        @hideVertexCoordinates()
        @hideVertexPointer()
        @hideLinePointer()

      when "polygon"
        @hideVertexCoordinates()
        @hideVertexPointer()
        @hideLinePointer()

    svg.on("click", null)
      .on("touchmove", null)
      .on("mousemove", null)


  showCurrentTool: =>
    switch currentTool
      when "move" then return null
      when "delete" then return null

      when "vertex"
        svg.on("click", @addVertex)
          .on("touchmove", @showVertexTool)
          .on("mousemove", @showVertexTool)

      when "line"
        svg.on("click", @addLine)
          .on("touchmove", @showLineTool)
          .on("mousemove", @showLineTool)

      when "polygon"
        svg.on("click", @addPolygon)
          .on("touchmove", @showPolygonTool)
          .on("mousemove", @showPolygonTool)


  #####
  # Grid graphical elements

  addGrid: =>
    x = origin.x - width * space / 2
    nbLinesX = Math.ceil(width * space / gridSize)
    for i in [0..nbLinesX]
      x += gridSize
      grid.append('line')
        .attr('x1', x)
        .attr('y1', origin.y - height * space)
        .attr('x2', x)
        .attr('y2', origin.y + height * space)

    y = origin.y - height * space / 2
    nbLinesY = Math.ceil(height * space / gridSize)
    for j in [0..nbLinesY]
      y += gridSize
      grid.append('line')
        .attr('x1', origin.x - width * space)
        .attr('y1', y)
        .attr('x2', origin.x + width * space)
        .attr('y2', y)


  addAxis: =>
    axis.append('line')
      .attr('class', 'axisX')
      .attr('x1', origin.x - width * space)
      .attr('y1', origin.y)
      .attr('x2', origin.x + width * space)
      .attr('y2', origin.y)

    axis.append('line')
      .attr('class', 'axisY')
      .attr('x1', origin.x)
      .attr('y1', origin.y - height * space)
      .attr('x2', origin.x)
      .attr('y2', origin.y + height * space)


  addNumbersToAxis: =>
    numbersCoord = []

    pos = origin.x - width * space / 2
    nbLines = Math.ceil(width * space / gridSize)
    for i in [0..nbLines]
      pos += gridSize
      x1 = pos
      y1 = origin.y + (gridSize - gridSize * 0.1) / 2
      realPos1 = @posToRealPos({x: x1, y: y1})
      numbersCoord.push({x: x1, y: y1, value: realPos1.x})

      x2 = origin.x - gridSize / 2
      y2 = pos
      realPos2 = @posToRealPos({x: x2, y: y2})
      numbersCoord.push({x: x2, y: y2, value: realPos2.y})

    numbersCoord = numbersCoord.filter (number) -> number.value isnt 0
    numbersCoord.push({x: origin.x - gridSize / 2.5, y: origin.y + gridSize / 2.5, value: 0})

    @addNumbersTextToAxis(numbersCoord)


  addNumbersTextToAxis: (data) ->
    axisNumbers.selectAll("text").data(data)
      .enter().append('text')
      .attr("class", "axis-number")
      .attr("x", (d) -> return d.x)
      .attr("y", (d) -> return d.y)
      .text((d) -> return d.value)
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")


  #####
  ## Drawing methods for shapes

   drawVertexs: (path, vertexs) =>
    vertexsGroup = path.select("g.vertexs")

    if vertexsGroup.empty() is true
      vertexsGroup = path.append("g").attr("class", "vertexs")

    vertexsCircle = vertexsGroup.selectAll("circle")
      .data(vertexs)

    vertexsCircle.enter().append("circle")
      .attr("class", "path-vertex")
      .attr("r", vertexSize)
      .on("mousedown", @onMouseDownVertex)
      .on("mouseup", @onMouseUpVertex)

    vertexsCircle.attr("cx", (d) -> return d.x)
      .attr("cy", (d) -> return d.y)

    vertexsCircle.exit().remove()


  drawLine: (path, vertexs) =>
    lineFunction = d3.svg.line()
      .x((d) -> return d.x)
      .y((d) -> return d.y)
      .interpolate("linear")

    @drawPath(path, vertexs, lineFunction)


  drawPolygon: (path, vertexs) =>
    polygonFunction = d3.svg.line()
      .x((d) -> return d.x)
      .y((d) -> return d.y)
      .interpolate("linear-closed")

    @drawPath(path, vertexs, polygonFunction)


  drawPath: (path, vertexs, lineFunction) =>
    path.on("mousemove", @showAddVertexHandle)
      .on("mouseout", @hideVertexHandle)
      .on("mousedown", @onMouseDownPath)
      .on("mouseup", @onMouseUpPath)

    pathGroup = path.select("g.path-group")

    if pathGroup.empty() is true
      pathGroup = path.append("g").attr("class", "path-group")

    pathGroup.selectAll("path").remove()  # TODO No join operation?
    pathGroup.append('path')
      .attr("d", lineFunction(vertexs))


  #####
  ## Event for shapes

  onMouseDownPath: (data, pathId) =>
    switch currentTool
      when "move" then @startDraggingPath()

  onMouseUpPath: (data, pathId) =>
    switch currentTool
      when "move" then @stopDraggingPath()
      when "delete" then @deletePath()

  onMouseMovePath: =>
    if currentTool is "move" then @updatePathPositions()


  onMouseDownVertex: (data, vertexId) =>
    switch currentTool
      when "move" then @startDraggingVertex(vertexId)

  onMouseUpVertex: (data, vertexId) =>
    switch currentTool
      when "move" then @stopDraggingVertex()
      when "delete" then @deleteVertex(vertexId)

  onMouseMoveVertex: =>
    switch currentTool
      when "move" then @updateVertexPosition()


  #####
  ## Vertex tool

  addVertex: =>
    d3.event.preventDefault()

    cx = vertexPointer.attr("cx")
    cy = vertexPointer.attr("cy")
    linesVertexs[lastLineIndex].push({x: parseFloat(cx), y: parseFloat(cy)})

    if linesVertexs[lastLineIndex].length is 1
      lastLine = linesTracer.append("g").attr("class", "path added-vertex")

    @drawVertexs(lastLine, linesVertexs[lastLineIndex])

    linesVertexs.push([])
    lastLineIndex++

    @switchToTool("move")


  showVertexTool: =>
    d3.event.preventDefault()

    coord = @getDrawingCoordinates(@getEventCoordinates())

    @showVertexPointer(coord)
    @showVertexCoordinates(coord)


  #####
  ## Line tool

  addLine: =>
    d3.event.preventDefault()

    if isDoubleClick is false
      isDoubleClick = true
      doubleClickTimer = setTimeout(@timerEndDoubleClick, 200)

      cx = vertexPointer.attr("cx")
      cy = vertexPointer.attr("cy")
      linesVertexs[lastLineIndex].push({x: parseFloat(cx), y: parseFloat(cy)})

      if linesVertexs[lastLineIndex].length is 1
        lastLine = linesTracer.append("g").attr("class", "path added-line")

      @drawLine(lastLine, linesVertexs[lastLineIndex])
      @drawVertexs(lastLine, linesVertexs[lastLineIndex])

    else
      linesTracer.select(".line-pointer").attr("style", "display:none")
      linesVertexs.push([])
      lastLineIndex++

      @switchToTool("move")


  timerEndDoubleClick: =>
    isDoubleClick = false


  showLineTool: =>
    d3.event.preventDefault()

    coord = @getDrawingCoordinates(@getEventCoordinates())

    @showVertexPointer(coord)
    @showVertexCoordinates(coord)

    if linesVertexs[lastLineIndex].length > 0
      @showLinePointer(coord)


  #####
  ## Polygon tool

  addPolygon: =>
    d3.event.preventDefault()

    if isDoubleClick is false
      isDoubleClick = true
      doubleClickTimer = setTimeout(@timerEndDoubleClick, 200)

      cx = vertexPointer.attr("cx")
      cy = vertexPointer.attr("cy")
      linesVertexs[lastLineIndex].push({x: parseFloat(cx), y: parseFloat(cy)})

      if linesVertexs[lastLineIndex].length is 1
        lastLine = linesTracer.append("g")
          .attr("class", "path added-polygon")

      @drawPolygon(lastLine, linesVertexs[lastLineIndex])
      @drawVertexs(lastLine, linesVertexs[lastLineIndex])

    else
      linesTracer.select(".line-pointer").attr("style", "display:none")
      linesVertexs.push([])
      lastLineIndex++

      @switchToTool("move")


  showPolygonTool: =>
    d3.event.preventDefault()

    coord = @getDrawingCoordinates(@getEventCoordinates())

    @showVertexPointer(coord)
    @showVertexCoordinates(coord)

    if linesVertexs[lastLineIndex].length in [1, 2]
      @showLinePointer(coord)
    else if linesVertexs[lastLineIndex].length > 2
      @showPolygonPointer(coord)


  #####
  ## Handles Add Vertex Tool

  showAddVertexHandle: =>
    if currentTool is "move" and not draggingVertex and not draggingPath 
      if d3.event.srcElement.nodeName in ["path", "circle"]
        path = d3.event.toElement
        parentPath = d3.select(path.parentNode)[0][0].parentElement
        pathIndex = @findParentPathIndex(parentPath)

      if not @isShapeEditable(parentPath)
        return 

      if d3.select(parentPath).select("g.handles").empty() is true
        d3.select(parentPath).append("g")
          .attr("class", "handles")

      clearTimeout(hideAddVertexHandleTimer)

      shapeType = @getParentPathShapeType(parentPath)
      handlesCoord = @getHandlesCoord(shapeType, linesVertexs[pathIndex])

      @updateHandles(parentPath, shapeType, handlesCoord)

    else
      @removeVertexHandles()
      

  updateHandles: (parentPath, shapeType, handlesCoord) =>
    handles = d3.select(parentPath).select("g.handles")
      .selectAll("circle.handle").data(handlesCoord)

    handles.enter().append("circle")
      .attr("class", "handle")
      .attr("r", vertexSize)
      .on("click", @onHandleClickAddVertex)

    handles.attr("cx", (d) -> return d.x)
    .attr("cy", (d) -> return d.y)

    handles.exit().remove()


  hideVertexHandle: =>
    hideAddVertexHandleTimer = setTimeout(@removeVertexHandles , 150)

  removeVertexHandles: =>
    linesTracer.selectAll("circle.handle").remove()


  getHandlesCoord: (shapeType, vertexs) =>
    handlesCoord = []

    for vertex, id in vertexs  
      x = y = 0

      if shapeType is "line"
        if id isnt (vertexs.length - 1)
          x = (vertex.x + vertexs[id + 1].x) / 2
          y = (vertex.y + vertexs[id + 1].y) / 2

          handlesCoord.push({x: x, y: y})

      else if shapeType is "polygon"
        if id is (vertexs.length - 1)
          x = (vertexs[0].x + vertex.x) / 2
          y = (vertexs[0].y + vertex.y) / 2
        else
          x = (vertex.x + vertexs[id + 1].x) / 2
          y = (vertex.y + vertexs[id + 1].y) / 2

        handlesCoord.push({x: x, y: y})

    return handlesCoord


  onHandleClickAddVertex: (data, handleId) =>
    handle = d3.event.toElement
    parentPath = d3.select(handle.parentNode)[0][0].parentElement
    pathIndex = @findParentPathIndex(parentPath)

    x = parseFloat(d3.select(handle).attr("cx"))
    y = parseFloat(d3.select(handle).attr("cy"))

    linesVertexs[pathIndex].splice(handleId + 1, 0, {x: x, y: y})

    if d3.select(parentPath).classed("added-polygon")
      @drawPolygon(d3.select(parentPath), linesVertexs[pathIndex])
    else if d3.select(parentPath).classed("added-line")
      @drawLine(d3.select(parentPath), linesVertexs[pathIndex])

    @drawVertexs(d3.select(parentPath), linesVertexs[pathIndex])


  #####
  ## Move tool

  startDraggingVertex: (vertexId) =>
    draggingVertex = yes
    draggedVertex = d3.event.toElement
    draggedVertexId = vertexId

    @registerSVGEvent("mousemove", @onMouseMoveVertex)
    @registerSVGEvent("mouseup", @onMouseUpVertex)


  stopDraggingVertex: =>
    draggingVertex = no
    draggedVertex = null
    draggedVertexId = - 1

    @unregisterSVGEvent("mousemove", @onMouseMoveVertex)
    @unregisterSVGEvent("mouseup", @onMouseUpVertex)

    @hideVertexCoordinates()

  updateVertexPosition: =>
    if draggingVertex is yes
      coord = @getDrawingCoordinates(@getEventCoordinates())
      parentPath = draggedVertex.parentNode.parentNode
      parentPathIndex = @findParentPathIndex(parentPath)

      if not @isShapeEditable(parentPath)
        return

      d3.select(draggedVertex)
        .attr("cx", coord.x)
        .attr("cy", coord.y)

      linesVertexs[parentPathIndex][draggedVertexId] = coord
      @showVertexCoordinates(coord)

      pathNode = d3.select(parentPath)
      if pathNode.classed("added-polygon") or pathNode.classed("initial-polygon")
        @drawPolygon(d3.select(parentPath), linesVertexs[parentPathIndex])
      else if pathNode.classed("added-line") or pathNode.classed("initial-shape")
        @drawLine(d3.select(parentPath), linesVertexs[parentPathIndex])


  startDraggingPath: =>
    path = d3.event.toElement

    if path.tagName is "path"
      parentPath = d3.event.toElement.parentNode.parentNode
      parentPathId = @findParentPathIndex(parentPath)

      if not @isShapeEditable(parentPath)
        return 

      draggingPath = yes
      draggedPath = parentPath
      draggedPathId = parentPathId
      lastMousePosition = @getDrawingCoordinates(@getEventCoordinates())

      @registerSVGEvent("mousemove", @onMouseMovePath)
      @registerSVGEvent("mouseup", @onMouseUpPath)


  stopDraggingPath: =>
    draggingPath = no
    draggedPath = null
    draggedPathId = - 1
    lastMousePosition = @getDrawingCoordinates(@getEventCoordinates())

    @unregisterSVGEvent("mousemove", @onMouseMovePath)
    @unregisterSVGEvent("mouseup", @onMouseUpPath)


  updatePathPositions: =>
    actualMouseCoord = @getDrawingCoordinates(@getEventCoordinates())

    if lastMousePosition?
      x = actualMouseCoord.x - lastMousePosition.x
      y = actualMouseCoord.y - lastMousePosition.y
      translation = {x: x, y: y}

      lastMousePosition = actualMouseCoord

      for vertex, id in linesVertexs[draggedPathId]
        vertex.x += translation.x
        vertex.y += translation.y
        linesVertexs[draggedPathId][id] = vertex

      shapeType = @getParentPathShapeType(draggedPath)
      if shapeType is "polygon"
        @drawPolygon(d3.select(draggedPath), linesVertexs[draggedPathId])
      else if shapeType is "line"
        @drawLine(d3.select(draggedPath), linesVertexs[draggedPathId])

      @drawVertexs(d3.select(draggedPath), linesVertexs[draggedPathId])


  #####
  ## Delete tool

  deleteVertex: (vertexId) =>
    vertex = d3.event.toElement
    parentPath = d3.select(vertex.parentNode)[0][0].parentElement
    pathNode = d3.select(parentPath)
    pathId = @findParentPathIndex(parentPath)

    if not @isShapeEditable(parentPath)
      return 

    linesVertexs[pathId].splice(vertexId, 1)
    if linesVertexs[pathId].length is 0
      linesVertexs.splice(pathId, 1)
      pathNode.remove()
      lastLineIndex--
      @drawVertexs(d3.select(parentPath), [])

    else
      @drawVertexs(d3.select(parentPath), linesVertexs[pathId])

      if pathNode.classed("added-polygon") or pathNode.classed("added-polygon")
        @drawPolygon(pathNode, linesVertexs[pathId])
      else if pathNode.classed("added-line") or pathNode.classed("initial-shape")
        @drawLine(pathNode, linesVertexs[pathId])


  deletePath: =>
    if d3.event.toElement.tagName is "path"
      path = d3.event.toElement
      parentPath = d3.select(path.parentNode)[0][0].parentElement
      pathId = @findParentPathIndex(parentPath)

      if not @isShapeEditable(parentPath)
        return 

      d3.select(parentPath).remove()
      linesVertexs.splice(pathId, 1)
      lastLineIndex--


  #####
  # Draw mode

  getDrawingCoordinates : (coord) =>
    switch currentDrawMode
      when "free" then return coord
      when "snapToGrid" then return @snapToGrid(coord)
      when "snapToIntersection" then return @snapToIntersection(coord)


  snapToGrid: (coord) =>
    factor = 0.15
    realCoord = @posToRealPos(coord)

    leftLine = Math.floor(realCoord.x)
    rightLine = Math.ceil(realCoord.x)
    bottomLine = Math.floor(realCoord.y)
    topLine = Math.ceil(realCoord.y)

    x = coord.x
    y = coord.y

    if leftLine <= realCoord.x < (leftLine + factor)
      x = @realXPosToPos(leftLine)
    else if (rightLine - factor) < realCoord.x <= rightLine
      x = @realXPosToPos(rightLine)

    if bottomLine <= realCoord.y < (bottomLine + factor)
      y = @realYPosToPos(bottomLine)
    else if (topLine - factor) < realCoord.y <= topLine
      y = @realYPosToPos(topLine)

    return {x: x, y: y}


  snapToIntersection: (coord) =>
    factor = 0.55
    realCoord = @posToRealPos(coord)

    leftLine = Math.floor(realCoord.x)
    rightLine = Math.ceil(realCoord.x)
    bottomLine = Math.floor(realCoord.y)
    topLine = Math.ceil(realCoord.y)

    x = coord.x
    y = coord.y

    if (leftLine <= realCoord.x < (leftLine + factor)) and (bottomLine <= realCoord.y < (bottomLine + factor))
      x = @realXPosToPos(leftLine)
      y = @realYPosToPos(bottomLine)
    else if (leftLine <= realCoord.x < (leftLine + factor)) and ((topLine - factor) < realCoord.y <= topLine)
      x = @realXPosToPos(leftLine)
      y = @realYPosToPos(topLine)
    else if ((rightLine - factor) < realCoord.x <= rightLine) and (bottomLine <= realCoord.y < (bottomLine + factor))
      x = @realXPosToPos(rightLine)
      y = @realYPosToPos(bottomLine)
    else if ((rightLine - factor) < realCoord.x <= rightLine) and ((topLine - factor) < realCoord.y <= topLine)
      x = @realXPosToPos(rightLine)
      y = @realYPosToPos(topLine)

    return {x: x, y: y}


  #####
  ## Pointers

  showVertexPointer: (coord) =>
    if not vertexPointer?
      vertexPointer = linesTracer.append("circle")
        .attr("class", "vertex-pointer")

    vertexPointer.attr("cx", coord.x)
      .attr("cy", coord.y)
      .attr("r", vertexSize)
      .attr("style", "display:inline")


  hideVertexPointer: =>
    if vertexPointer?
      vertexPointer.attr("style", "display: none")


  showVertexCoordinates: (coord) =>
    if not vertexCoordinates?
      vertexCoordinates = linesTracer.append('text')
        .attr("class", "vertex-coordinates")

    realCoord = @posToRealPos(coord)

    vertexCoordinates.attr("x", coord.x + 7)
      .attr("y", coord.y - 15)
      .text("(#{realCoord.x}, #{realCoord.y})")
      .attr("style", "display:inline")


  hideVertexCoordinates: =>
    if vertexCoordinates?
      vertexCoordinates.attr("style", "display: none")


  showLinePointer: =>
    if not linePointer?
      linePointer = linesTracer.append("line")
        .attr("class", "line-pointer")

    lastVertex = linesVertexs[lastLineIndex].slice(-1)[0]
    cx = vertexPointer.attr("cx")
    cy = vertexPointer.attr("cy")

    linePointer.attr("x1", lastVertex.x)
      .attr("y1", lastVertex.y)
      .attr("x2", cx)
      .attr("y2", cy)
      .attr("style", "display:inline")


  hideLinePointer: =>
    if linePointer?
      linePointer.attr("style", "display: none")


  showPolygonPointer: (coord) =>
    vertexList = linesVertexs[lastLineIndex].slice(0)
    vertexList.push(coord)

    @drawPolygon(lastLine, vertexList)
    @drawVertexs(lastLine, linesVertexs[lastLineIndex])


  #####
  # Utils

  getEventCoordinates: =>
    if d3.event instanceof MouseEvent
      return {x: d3.mouse(node)[0], y: d3.mouse(node)[1]}
    else if d3.event instanceof TouchEvent
      return {x: d3.touches(node)[0][0], y: d3.touches(node)[0][1]}


  findParentPathIndex: (pathToFind) =>
    paths = linesTracer.selectAll("g.path")[0]

    for path, id in paths
      if pathToFind is path
        return id

    return -1


  getParentPathShapeType: (parentPath) =>
    if d3.select(parentPath).classed("added-line") is yes
      return "line"
    else if d3.select(parentPath).classed("added-polygon") is yes
      return "polygon"


  posToRealPos: (coord) =>
    realX = @truncateFloat((coord.x - origin.x) / gridSize)
    realY = @truncateFloat((origin.y - coord.y) / gridSize)

    return {x: realX, y: realY}

  realPosToPos: (realCoord) =>
    return {x: @realXPosToPos(realCoord.x), y: @realYPosToPos(realCoord.y)}

  realXPosToPos: (realXPos) =>
    return realXPos * gridSize + origin.x

  realYPosToPos: (realYPos) =>
    return origin.y - realYPos * gridSize

  truncateFloat: (number) =>
    return Math.round(number * 10) / 10

  moveOrigin: (x, y) =>
    invertedY = - 1 * y
    svg.attr('transform', 'translate(' + x + ',' + invertedY + ')')


  #####
  # Add or get added path

  getAllShapes: =>
    result = {vertexs: [], lines: [], polygons: []}

    for shape, id in linesVertexs
      if shape.length != 0
        for shapeType in ["vertex", "line", "polygon"]
          if d3.select(paths[id]).classed("added-" + shapeType)
            if shapeType is "vertex"
              result[shapeType+"s"].push(shape[0])
            else
              result[shapeType+"s"].push(shape)
            break

    return result


  getAddedShapes: =>
    paths = linesTracer.selectAll("g.path:not(.initial-shape)")[0]
    result = {vertexs: [], lines: [], polygons: []}

    for path in paths
      pathId = @findParentPathIndex(path)

      for shapeType in ["vertex", "line", "polygon"]
        if d3.select(path).classed("added-" + shapeType)
          if shapeType is "vertex"
            result[shapeType+"s"].push(linesVertexs[pathId][0])
          else
            result[shapeType+"s"].push(linesVertexs[pathId])
          break

    return result
    

  addInitialVertex: (vertexs) =>
    for vertex in vertexs
      if linesVertexs[lastLineIndex].length isnt 0
        linesVertexs.push([])
        lastLineIndex++

      linesVertexs[lastLineIndex].push(@realPosToPos(vertex))  
      lastVertex = linesTracer.append("g").attr("class", "path added-vertex initial-shape")
      @drawVertexs(lastVertex, [ @realPosToPos(vertex) ])
      linesVertexs.push([])
      lastLineIndex++


  addInitialPath: (paths, pathType) =>
    for path in paths
      vertexs = [] 
      if linesVertexs[lastLineIndex].length isnt 0
        linesVertexs.push([])
        lastLineIndex++

      for vertex in path
        vertexs.push(@realPosToPos(vertex))
        
      linesVertexs[lastLineIndex] = vertexs
      @drawInitialPath(vertexs, pathType)
      linesVertexs.push([])
      lastLineIndex++


  drawInitialPath: (vertexs, pathType) =>
      if pathType is "line"
        lastLine = linesTracer.append("g").attr("class", "path added-line initial-shape")
        @drawLine(lastLine, vertexs)
      else if pathType is "polygon"
        lastLine = linesTracer.append("g").attr("class", "path added-polygon initial-shape")
        @drawPolygon(lastLine, vertexs)

      @drawVertexs(lastLine, vertexs)


  addShapes: (shapes) =>
    if shapes.vertexs?
      @addInitialVertex(shapes.vertexs)

    if shapes.lines?
      @addInitialPath(shapes.lines, "line")

    if shapes.polygons?
      @addInitialPath(shapes.polygons, "polygon")


  #####
  ## Register event

  registerSVGEvent: (eventName, callback) =>
    if not registeredEvent[eventName]?
      svg.on(eventName, @fireCallback)
      registeredEvent[eventName] = []

    registeredEvent[eventName].push(callback)


  unregisterSVGEvent: (eventName, callback) =>
    if registeredEvent[eventName]?
      callbackIndex = registeredEvent[eventName].indexOf(callback)

      if callbackIndex isnt -1
        if registeredEvent[eventName].lenght >= 2
          registeredEvent[eventName].splice(callbackIndex, 1)  
        else 
          delete registeredEvent[eventName]
          svg.on(eventName, null)


  fireCallback: =>
    eventType = d3.event.type

    for callback in registeredEvent[eventType]
      callback()


  ####
  # Accessor

  setDrawingMode: (mode) =>
    if mode in drawModes
      currentDrawMode = mode

  setTool: (tool) =>
    if tool in tools
      currentTool = tool

  setInitialPathEditable: (isEditable) =>
    initialPathEditable = isEditable

  isShapeEditable: (path) =>
    return not (d3.select(path).classed("initial-shape") is true and initialPathEditable is false)

