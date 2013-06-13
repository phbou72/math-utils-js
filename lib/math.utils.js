(function() {
  var MathUtils;

  MathUtils = (typeof exports !== "undefined" && exports !== null) && exports || (this.MathUtils = {});

}).call(this);

(function() {
  MathUtils.EquationParser = (function() {
    function EquationParser() {}

    EquationParser.prototype.evaluate = function(expression) {
      var index, str;

      if (expression !== void 0) {
        index = expression.indexOf(".");
      }
      try {
        return EquationEvaluator.parse(expression);
      } catch (_error) {
        str = _error;
        return "";
      }
    };

    EquationParser.prototype.convertToLaTex = function(expression) {
      var str;

      try {
        if (expression.length > 0) {
          return EquationToLaTex.parse(expression);
        } else {
          return "" + expression;
        }
      } catch (_error) {
        str = _error;
        return expression;
      }
    };

    return EquationParser;

  })();

  /*
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
  */


}).call(this);

/*
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
*/


(function() {


}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  MathUtils.GraphPaper = (function() {
    var axis, axisNumbers, currentDrawMode, currentTool, doubleClickTimer, draggedPath, draggedPathId, draggedVertex, draggedVertexId, draggingPath, draggingVertex, drawModes, grid, gridSize, height, hideAddVertexHandleTimer, initialPathEditable, isDoubleClick, lastLine, lastLineIndex, lastMousePosition, linePointer, linesTracer, linesVertexs, node, origin, polygonPointer, registeredEvent, space, svg, tools, vertexCoordinates, vertexPointer, vertexSize, width;

    width = 400;

    height = 300;

    gridSize = 50;

    vertexSize = 8;

    origin = {
      x: 0,
      y: 0
    };

    space = 5;

    svg = null;

    node = null;

    grid = null;

    axis = null;

    axisNumbers = null;

    isDoubleClick = false;

    doubleClickTimer = null;

    linesTracer = null;

    linesVertexs = [[]];

    lastLineIndex = 0;

    lastLine = null;

    draggingVertex = false;

    draggedVertex = null;

    draggedVertexId = -1;

    draggingPath = false;

    draggedPath = null;

    draggedPathId = -1;

    lastMousePosition = null;

    vertexPointer = null;

    vertexCoordinates = null;

    linePointer = null;

    polygonPointer = null;

    drawModes = ["free", "snapToGrid", "snapToIntersection"];

    currentDrawMode = "snapToIntersection";

    tools = ["move", "delete", "vertex", "line", "polygon"];

    currentTool = "move";

    registeredEvent = [];

    initialPathEditable = true;

    hideAddVertexHandleTimer = null;

    function GraphPaper(selector, width, height) {
      this.setInitialPathEditable = __bind(this.setInitialPathEditable, this);
      this.setTool = __bind(this.setTool, this);
      this.setDrawingMode = __bind(this.setDrawingMode, this);
      this.fireCallback = __bind(this.fireCallback, this);
      this.unregisterSVGEvent = __bind(this.unregisterSVGEvent, this);
      this.registerSVGEvent = __bind(this.registerSVGEvent, this);
      this.addShapes = __bind(this.addShapes, this);
      this.drawInitialPath = __bind(this.drawInitialPath, this);
      this.addInitialPath = __bind(this.addInitialPath, this);
      this.addInitialVertex = __bind(this.addInitialVertex, this);
      this.getAddedShapes = __bind(this.getAddedShapes, this);
      this.getAllShapes = __bind(this.getAllShapes, this);
      this.isShapeEditable = __bind(this.isShapeEditable, this);
      this.moveOrigin = __bind(this.moveOrigin, this);
      this.truncateFloat = __bind(this.truncateFloat, this);
      this.realYPosToPos = __bind(this.realYPosToPos, this);
      this.realXPosToPos = __bind(this.realXPosToPos, this);
      this.realPosToPos = __bind(this.realPosToPos, this);
      this.posToRealPos = __bind(this.posToRealPos, this);
      this.getParentPathShapeType = __bind(this.getParentPathShapeType, this);
      this.findParentPathIndex = __bind(this.findParentPathIndex, this);
      this.getEventCoordinates = __bind(this.getEventCoordinates, this);
      this.showPolygonPointer = __bind(this.showPolygonPointer, this);
      this.hideLinePointer = __bind(this.hideLinePointer, this);
      this.showLinePointer = __bind(this.showLinePointer, this);
      this.hideVertexCoordinates = __bind(this.hideVertexCoordinates, this);
      this.showVertexCoordinates = __bind(this.showVertexCoordinates, this);
      this.hideVertexPointer = __bind(this.hideVertexPointer, this);
      this.showVertexPointer = __bind(this.showVertexPointer, this);
      this.snapToIntersection = __bind(this.snapToIntersection, this);
      this.snapToGrid = __bind(this.snapToGrid, this);
      this.getDrawingCoordinates = __bind(this.getDrawingCoordinates, this);
      this.deletePath = __bind(this.deletePath, this);
      this.deleteVertex = __bind(this.deleteVertex, this);
      this.updatePathPositions = __bind(this.updatePathPositions, this);
      this.stopDraggingPath = __bind(this.stopDraggingPath, this);
      this.startDraggingPath = __bind(this.startDraggingPath, this);
      this.updateVertexPosition = __bind(this.updateVertexPosition, this);
      this.stopDraggingVertex = __bind(this.stopDraggingVertex, this);
      this.startDraggingVertex = __bind(this.startDraggingVertex, this);
      this.onHandleClickAddVertex = __bind(this.onHandleClickAddVertex, this);
      this.getHandlesCoord = __bind(this.getHandlesCoord, this);
      this.removeVertexHandles = __bind(this.removeVertexHandles, this);
      this.hideVertexHandle = __bind(this.hideVertexHandle, this);
      this.updateHandles = __bind(this.updateHandles, this);
      this.showAddVertexHandle = __bind(this.showAddVertexHandle, this);
      this.showPolygonTool = __bind(this.showPolygonTool, this);
      this.addPolygon = __bind(this.addPolygon, this);
      this.showLineTool = __bind(this.showLineTool, this);
      this.timerEndDoubleClick = __bind(this.timerEndDoubleClick, this);
      this.addLine = __bind(this.addLine, this);
      this.showVertexTool = __bind(this.showVertexTool, this);
      this.addVertex = __bind(this.addVertex, this);
      this.onMouseMoveVertex = __bind(this.onMouseMoveVertex, this);
      this.onMouseUpVertex = __bind(this.onMouseUpVertex, this);
      this.onMouseDownVertex = __bind(this.onMouseDownVertex, this);
      this.onMouseMovePath = __bind(this.onMouseMovePath, this);
      this.onMouseUpPath = __bind(this.onMouseUpPath, this);
      this.onMouseDownPath = __bind(this.onMouseDownPath, this);
      this.drawPath = __bind(this.drawPath, this);
      this.drawPolygon = __bind(this.drawPolygon, this);
      this.drawLine = __bind(this.drawLine, this);
      this.drawVertexs = __bind(this.drawVertexs, this);
      this.addNumbersToAxis = __bind(this.addNumbersToAxis, this);
      this.addAxis = __bind(this.addAxis, this);
      this.addGrid = __bind(this.addGrid, this);
      this.showCurrentTool = __bind(this.showCurrentTool, this);
      this.hideCurrentTool = __bind(this.hideCurrentTool, this);
      this.switchToTool = __bind(this.switchToTool, this);
      this.initToolsButton = __bind(this.initToolsButton, this);
      var parent;

      svg = d3.select(selector);
      parent = svg.node().parentNode.getBoundingClientRect();
      width = parent.width;
      height = parent.height;
      origin = {
        x: gridSize,
        y: height - gridSize
      };
      svg = svg.append('g');
      node = svg.node();
      svg.append('rect').attr("class", "background").attr("width", width * space).attr("height", height * space).attr("x", -1 * width * space / 2);
      grid = svg.append('g').attr("class", "grid");
      axis = svg.append('g').attr("class", "axis");
      axisNumbers = svg.append("g").attr("class", "axis-numbers");
      this.addGrid();
      this.addAxis();
      this.addNumbersToAxis();
      linesTracer = svg.append("g").attr("class", "line-tracer");
      this.initToolsButton();
    }

    GraphPaper.prototype.initToolsButton = function() {
      var _this = this;

      return _.each(tools, function(tool) {
        var button;

        button = d3.select(node.parentNode.parentNode).select("." + tool)[0][0];
        if (tool === currentTool) {
          d3.select(button).classed("active", "active");
        }
        return d3.select(button).on("click", function(element, id) {
          _this.switchToTool(tool);
          return d3.event.preventDefault();
        });
      });
    };

    GraphPaper.prototype.switchToTool = function(toolName) {
      this.hideCurrentTool();
      currentTool = toolName;
      return this.showCurrentTool();
    };

    GraphPaper.prototype.hideCurrentTool = function() {
      switch (currentTool) {
        case "move":
          return null;
        case "delete":
          return null;
        case "vertex":
          this.hideVertexPointer();
          this.hideVertexCoordinates();
          break;
        case "line":
          this.hideVertexCoordinates();
          this.hideVertexPointer();
          this.hideLinePointer();
          break;
        case "polygon":
          this.hideVertexCoordinates();
          this.hideVertexPointer();
          this.hideLinePointer();
      }
      return svg.on("click", null).on("touchmove", null).on("mousemove", null);
    };

    GraphPaper.prototype.showCurrentTool = function() {
      switch (currentTool) {
        case "move":
          return null;
        case "delete":
          return null;
        case "vertex":
          return svg.on("click", this.addVertex).on("touchmove", this.showVertexTool).on("mousemove", this.showVertexTool);
        case "line":
          return svg.on("click", this.addLine).on("touchmove", this.showLineTool).on("mousemove", this.showLineTool);
        case "polygon":
          return svg.on("click", this.addPolygon).on("touchmove", this.showPolygonTool).on("mousemove", this.showPolygonTool);
      }
    };

    GraphPaper.prototype.addGrid = function() {
      var i, j, nbLinesX, nbLinesY, x, y, _i, _j, _results;

      x = origin.x - width * space / 2;
      nbLinesX = Math.ceil(width * space / gridSize);
      for (i = _i = 0; 0 <= nbLinesX ? _i <= nbLinesX : _i >= nbLinesX; i = 0 <= nbLinesX ? ++_i : --_i) {
        x += gridSize;
        grid.append('line').attr('x1', x).attr('y1', origin.y - height * space).attr('x2', x).attr('y2', origin.y + height * space);
      }
      y = origin.y - height * space / 2;
      nbLinesY = Math.ceil(height * space / gridSize);
      _results = [];
      for (j = _j = 0; 0 <= nbLinesY ? _j <= nbLinesY : _j >= nbLinesY; j = 0 <= nbLinesY ? ++_j : --_j) {
        y += gridSize;
        _results.push(grid.append('line').attr('x1', origin.x - width * space).attr('y1', y).attr('x2', origin.x + width * space).attr('y2', y));
      }
      return _results;
    };

    GraphPaper.prototype.addAxis = function() {
      axis.append('line').attr('class', 'axisX').attr('x1', origin.x - width * space).attr('y1', origin.y).attr('x2', origin.x + width * space).attr('y2', origin.y);
      return axis.append('line').attr('class', 'axisY').attr('x1', origin.x).attr('y1', origin.y - height * space).attr('x2', origin.x).attr('y2', origin.y + height * space);
    };

    GraphPaper.prototype.addNumbersToAxis = function() {
      var i, nbLines, numbersCoord, pos, realPos1, realPos2, x1, x2, y1, y2, _i;

      numbersCoord = [];
      pos = origin.x - width * space / 2;
      nbLines = Math.ceil(width * space / gridSize);
      for (i = _i = 0; 0 <= nbLines ? _i <= nbLines : _i >= nbLines; i = 0 <= nbLines ? ++_i : --_i) {
        pos += gridSize;
        x1 = pos;
        y1 = origin.y + (gridSize - gridSize * 0.1) / 2;
        realPos1 = this.posToRealPos({
          x: x1,
          y: y1
        });
        numbersCoord.push({
          x: x1,
          y: y1,
          value: realPos1.x
        });
        x2 = origin.x - gridSize / 2;
        y2 = pos;
        realPos2 = this.posToRealPos({
          x: x2,
          y: y2
        });
        numbersCoord.push({
          x: x2,
          y: y2,
          value: realPos2.y
        });
      }
      numbersCoord = numbersCoord.filter(function(number) {
        return number.value !== 0;
      });
      numbersCoord.push({
        x: origin.x - gridSize / 2.5,
        y: origin.y + gridSize / 2.5,
        value: 0
      });
      return this.addNumbersTextToAxis(numbersCoord);
    };

    GraphPaper.prototype.addNumbersTextToAxis = function(data) {
      return axisNumbers.selectAll("text").data(data).enter().append('text').attr("class", "axis-number").attr("x", function(d) {
        return d.x;
      }).attr("y", function(d) {
        return d.y;
      }).text(function(d) {
        return d.value;
      }).attr("text-anchor", "middle").attr("dy", ".35em");
    };

    GraphPaper.prototype.drawVertexs = function(path, vertexs) {
      var vertexsCircle, vertexsGroup;

      vertexsGroup = path.select("g.vertexs");
      if (vertexsGroup.empty() === true) {
        vertexsGroup = path.append("g").attr("class", "vertexs");
      }
      vertexsCircle = vertexsGroup.selectAll("circle").data(vertexs);
      vertexsCircle.enter().append("circle").attr("class", "path-vertex").attr("r", vertexSize).on("mousedown", this.onMouseDownVertex).on("mouseup", this.onMouseUpVertex);
      vertexsCircle.attr("cx", function(d) {
        return d.x;
      }).attr("cy", function(d) {
        return d.y;
      });
      return vertexsCircle.exit().remove();
    };

    GraphPaper.prototype.drawLine = function(path, vertexs) {
      var lineFunction;

      lineFunction = d3.svg.line().x(function(d) {
        return d.x;
      }).y(function(d) {
        return d.y;
      }).interpolate("linear");
      return this.drawPath(path, vertexs, lineFunction);
    };

    GraphPaper.prototype.drawPolygon = function(path, vertexs) {
      var polygonFunction;

      polygonFunction = d3.svg.line().x(function(d) {
        return d.x;
      }).y(function(d) {
        return d.y;
      }).interpolate("linear-closed");
      return this.drawPath(path, vertexs, polygonFunction);
    };

    GraphPaper.prototype.drawPath = function(path, vertexs, lineFunction) {
      var pathGroup;

      path.on("mousemove", this.showAddVertexHandle).on("mouseout", this.hideVertexHandle).on("mousedown", this.onMouseDownPath).on("mouseup", this.onMouseUpPath);
      pathGroup = path.select("g.path-group");
      if (pathGroup.empty() === true) {
        pathGroup = path.append("g").attr("class", "path-group");
      }
      pathGroup.selectAll("path").remove();
      return pathGroup.append('path').attr("d", lineFunction(vertexs));
    };

    GraphPaper.prototype.onMouseDownPath = function(data, pathId) {
      switch (currentTool) {
        case "move":
          return this.startDraggingPath();
      }
    };

    GraphPaper.prototype.onMouseUpPath = function(data, pathId) {
      switch (currentTool) {
        case "move":
          return this.stopDraggingPath();
        case "delete":
          return this.deletePath();
      }
    };

    GraphPaper.prototype.onMouseMovePath = function() {
      if (currentTool === "move") {
        return this.updatePathPositions();
      }
    };

    GraphPaper.prototype.onMouseDownVertex = function(data, vertexId) {
      switch (currentTool) {
        case "move":
          return this.startDraggingVertex(vertexId);
      }
    };

    GraphPaper.prototype.onMouseUpVertex = function(data, vertexId) {
      switch (currentTool) {
        case "move":
          return this.stopDraggingVertex();
        case "delete":
          return this.deleteVertex(vertexId);
      }
    };

    GraphPaper.prototype.onMouseMoveVertex = function() {
      switch (currentTool) {
        case "move":
          return this.updateVertexPosition();
      }
    };

    GraphPaper.prototype.addVertex = function() {
      var cx, cy;

      d3.event.preventDefault();
      cx = vertexPointer.attr("cx");
      cy = vertexPointer.attr("cy");
      linesVertexs[lastLineIndex].push({
        x: parseFloat(cx),
        y: parseFloat(cy)
      });
      if (linesVertexs[lastLineIndex].length === 1) {
        lastLine = linesTracer.append("g").attr("class", "path added-vertex");
      }
      this.drawVertexs(lastLine, linesVertexs[lastLineIndex]);
      linesVertexs.push([]);
      lastLineIndex++;
      return this.switchToTool("move");
    };

    GraphPaper.prototype.showVertexTool = function() {
      var coord;

      d3.event.preventDefault();
      coord = this.getDrawingCoordinates(this.getEventCoordinates());
      this.showVertexPointer(coord);
      return this.showVertexCoordinates(coord);
    };

    GraphPaper.prototype.addLine = function() {
      var cx, cy;

      d3.event.preventDefault();
      if (isDoubleClick === false) {
        isDoubleClick = true;
        doubleClickTimer = setTimeout(this.timerEndDoubleClick, 200);
        cx = vertexPointer.attr("cx");
        cy = vertexPointer.attr("cy");
        linesVertexs[lastLineIndex].push({
          x: parseFloat(cx),
          y: parseFloat(cy)
        });
        if (linesVertexs[lastLineIndex].length === 1) {
          lastLine = linesTracer.append("g").attr("class", "path added-line");
        }
        this.drawLine(lastLine, linesVertexs[lastLineIndex]);
        return this.drawVertexs(lastLine, linesVertexs[lastLineIndex]);
      } else {
        linesTracer.select(".line-pointer").attr("style", "display:none");
        linesVertexs.push([]);
        lastLineIndex++;
        return this.switchToTool("move");
      }
    };

    GraphPaper.prototype.timerEndDoubleClick = function() {
      return isDoubleClick = false;
    };

    GraphPaper.prototype.showLineTool = function() {
      var coord;

      d3.event.preventDefault();
      coord = this.getDrawingCoordinates(this.getEventCoordinates());
      this.showVertexPointer(coord);
      this.showVertexCoordinates(coord);
      if (linesVertexs[lastLineIndex].length > 0) {
        return this.showLinePointer(coord);
      }
    };

    GraphPaper.prototype.addPolygon = function() {
      var cx, cy;

      d3.event.preventDefault();
      if (isDoubleClick === false) {
        isDoubleClick = true;
        doubleClickTimer = setTimeout(this.timerEndDoubleClick, 200);
        cx = vertexPointer.attr("cx");
        cy = vertexPointer.attr("cy");
        linesVertexs[lastLineIndex].push({
          x: parseFloat(cx),
          y: parseFloat(cy)
        });
        if (linesVertexs[lastLineIndex].length === 1) {
          lastLine = linesTracer.append("g").attr("class", "path added-polygon");
        }
        this.drawPolygon(lastLine, linesVertexs[lastLineIndex]);
        return this.drawVertexs(lastLine, linesVertexs[lastLineIndex]);
      } else {
        linesTracer.select(".line-pointer").attr("style", "display:none");
        linesVertexs.push([]);
        lastLineIndex++;
        return this.switchToTool("move");
      }
    };

    GraphPaper.prototype.showPolygonTool = function() {
      var coord, _ref;

      d3.event.preventDefault();
      coord = this.getDrawingCoordinates(this.getEventCoordinates());
      this.showVertexPointer(coord);
      this.showVertexCoordinates(coord);
      if ((_ref = linesVertexs[lastLineIndex].length) === 1 || _ref === 2) {
        return this.showLinePointer(coord);
      } else if (linesVertexs[lastLineIndex].length > 2) {
        return this.showPolygonPointer(coord);
      }
    };

    GraphPaper.prototype.showAddVertexHandle = function() {
      var handlesCoord, parentPath, path, pathIndex, shapeType, _ref;

      if (currentTool === "move" && !draggingVertex && !draggingPath) {
        if ((_ref = d3.event.target.nodeName) === "path" || _ref === "circle") {
          path = d3.event.target;
          parentPath = d3.select(path.parentNode)[0][0].parentNode;
          pathIndex = this.findParentPathIndex(parentPath);
        }
        if (!this.isShapeEditable(parentPath)) {
          return;
        }
        if (d3.select(parentPath).select("g.handles").empty() === true) {
          d3.select(parentPath).append("g").attr("class", "handles");
        }
        clearTimeout(hideAddVertexHandleTimer);
        shapeType = this.getParentPathShapeType(parentPath);
        handlesCoord = this.getHandlesCoord(shapeType, linesVertexs[pathIndex]);
        return this.updateHandles(parentPath, shapeType, handlesCoord);
      } else {
        return this.removeVertexHandles();
      }
    };

    GraphPaper.prototype.updateHandles = function(parentPath, shapeType, handlesCoord) {
      var handles;

      handles = d3.select(parentPath).select("g.handles").selectAll("circle.handle").data(handlesCoord);
      handles.enter().append("circle").attr("class", "handle").attr("r", vertexSize).on("click", this.onHandleClickAddVertex);
      handles.attr("cx", function(d) {
        return d.x;
      }).attr("cy", function(d) {
        return d.y;
      });
      return handles.exit().remove();
    };

    GraphPaper.prototype.hideVertexHandle = function() {
      return hideAddVertexHandleTimer = setTimeout(this.removeVertexHandles, 150);
    };

    GraphPaper.prototype.removeVertexHandles = function() {
      return linesTracer.selectAll("circle.handle").remove();
    };

    GraphPaper.prototype.getHandlesCoord = function(shapeType, vertexs) {
      var handlesCoord, id, vertex, x, y, _i, _len;

      handlesCoord = [];
      for (id = _i = 0, _len = vertexs.length; _i < _len; id = ++_i) {
        vertex = vertexs[id];
        x = y = 0;
        if (shapeType === "line") {
          if (id !== (vertexs.length - 1)) {
            x = (vertex.x + vertexs[id + 1].x) / 2;
            y = (vertex.y + vertexs[id + 1].y) / 2;
            handlesCoord.push({
              x: x,
              y: y
            });
          }
        } else if (shapeType === "polygon") {
          if (id === (vertexs.length - 1)) {
            x = (vertexs[0].x + vertex.x) / 2;
            y = (vertexs[0].y + vertex.y) / 2;
          } else {
            x = (vertex.x + vertexs[id + 1].x) / 2;
            y = (vertex.y + vertexs[id + 1].y) / 2;
          }
          handlesCoord.push({
            x: x,
            y: y
          });
        }
      }
      return handlesCoord;
    };

    GraphPaper.prototype.onHandleClickAddVertex = function(data, handleId) {
      var handle, parentPath, pathIndex, x, y;

      handle = d3.event.target;
      parentPath = d3.select(handle.parentNode)[0][0].parentNode;
      pathIndex = this.findParentPathIndex(parentPath);
      x = parseFloat(d3.select(handle).attr("cx"));
      y = parseFloat(d3.select(handle).attr("cy"));
      linesVertexs[pathIndex].splice(handleId + 1, 0, {
        x: x,
        y: y
      });
      if (d3.select(parentPath).classed("added-polygon")) {
        this.drawPolygon(d3.select(parentPath), linesVertexs[pathIndex]);
      } else if (d3.select(parentPath).classed("added-line")) {
        this.drawLine(d3.select(parentPath), linesVertexs[pathIndex]);
      }
      return this.drawVertexs(d3.select(parentPath), linesVertexs[pathIndex]);
    };

    GraphPaper.prototype.startDraggingVertex = function(vertexId) {
      draggingVertex = true;
      draggedVertex = d3.event.target;
      draggedVertexId = vertexId;
      this.registerSVGEvent("mousemove", this.onMouseMoveVertex);
      return this.registerSVGEvent("mouseup", this.onMouseUpVertex);
    };

    GraphPaper.prototype.stopDraggingVertex = function() {
      draggingVertex = false;
      draggedVertex = null;
      draggedVertexId = -1;
      this.unregisterSVGEvent("mousemove", this.onMouseMoveVertex);
      this.unregisterSVGEvent("mouseup", this.onMouseUpVertex);
      return this.hideVertexCoordinates();
    };

    GraphPaper.prototype.updateVertexPosition = function() {
      var coord, parentPath, parentPathIndex, pathNode;

      if (draggingVertex === true) {
        coord = this.getDrawingCoordinates(this.getEventCoordinates());
        parentPath = draggedVertex.parentNode.parentNode;
        parentPathIndex = this.findParentPathIndex(parentPath);
        if (!this.isShapeEditable(parentPath)) {
          return;
        }
        d3.select(draggedVertex).attr("cx", coord.x).attr("cy", coord.y);
        linesVertexs[parentPathIndex][draggedVertexId] = coord;
        this.showVertexCoordinates(coord);
        pathNode = d3.select(parentPath);
        if (pathNode.classed("added-polygon") || pathNode.classed("initial-polygon")) {
          return this.drawPolygon(d3.select(parentPath), linesVertexs[parentPathIndex]);
        } else if (pathNode.classed("added-line") || pathNode.classed("initial-shape")) {
          return this.drawLine(d3.select(parentPath), linesVertexs[parentPathIndex]);
        }
      }
    };

    GraphPaper.prototype.startDraggingPath = function() {
      var parentPath, parentPathId, path;

      path = d3.event.target;
      if (path.tagName === "path") {
        parentPath = path.parentNode.parentNode;
        parentPathId = this.findParentPathIndex(parentPath);
        if (!this.isShapeEditable(parentPath)) {
          return;
        }
        draggingPath = true;
        draggedPath = parentPath;
        draggedPathId = parentPathId;
        lastMousePosition = this.getDrawingCoordinates(this.getEventCoordinates());
        this.registerSVGEvent("mousemove", this.onMouseMovePath);
        return this.registerSVGEvent("mouseup", this.onMouseUpPath);
      }
    };

    GraphPaper.prototype.stopDraggingPath = function() {
      draggingPath = false;
      draggedPath = null;
      draggedPathId = -1;
      lastMousePosition = this.getDrawingCoordinates(this.getEventCoordinates());
      this.unregisterSVGEvent("mousemove", this.onMouseMovePath);
      return this.unregisterSVGEvent("mouseup", this.onMouseUpPath);
    };

    GraphPaper.prototype.updatePathPositions = function() {
      var actualMouseCoord, id, shapeType, translation, vertex, x, y, _i, _len, _ref;

      actualMouseCoord = this.getDrawingCoordinates(this.getEventCoordinates());
      if (lastMousePosition != null) {
        x = actualMouseCoord.x - lastMousePosition.x;
        y = actualMouseCoord.y - lastMousePosition.y;
        translation = {
          x: x,
          y: y
        };
        lastMousePosition = actualMouseCoord;
        _ref = linesVertexs[draggedPathId];
        for (id = _i = 0, _len = _ref.length; _i < _len; id = ++_i) {
          vertex = _ref[id];
          vertex.x += translation.x;
          vertex.y += translation.y;
          linesVertexs[draggedPathId][id] = vertex;
        }
        shapeType = this.getParentPathShapeType(draggedPath);
        if (shapeType === "polygon") {
          this.drawPolygon(d3.select(draggedPath), linesVertexs[draggedPathId]);
        } else if (shapeType === "line") {
          this.drawLine(d3.select(draggedPath), linesVertexs[draggedPathId]);
        }
        return this.drawVertexs(d3.select(draggedPath), linesVertexs[draggedPathId]);
      }
    };

    GraphPaper.prototype.deleteVertex = function(vertexId) {
      var parentPath, pathId, pathNode, vertex;

      vertex = d3.event.target;
      parentPath = d3.select(vertex.parentNode)[0][0].parentNode;
      pathNode = d3.select(parentPath);
      pathId = this.findParentPathIndex(parentPath);
      if (!this.isShapeEditable(parentPath)) {
        return;
      }
      linesVertexs[pathId].splice(vertexId, 1);
      if (linesVertexs[pathId].length === 0) {
        linesVertexs.splice(pathId, 1);
        pathNode.remove();
        lastLineIndex--;
        return this.drawVertexs(d3.select(parentPath), []);
      } else {
        this.drawVertexs(d3.select(parentPath), linesVertexs[pathId]);
        if (pathNode.classed("added-polygon") || pathNode.classed("added-polygon")) {
          return this.drawPolygon(pathNode, linesVertexs[pathId]);
        } else if (pathNode.classed("added-line") || pathNode.classed("initial-shape")) {
          return this.drawLine(pathNode, linesVertexs[pathId]);
        }
      }
    };

    GraphPaper.prototype.deletePath = function() {
      var parentPath, path, pathId;

      path = d3.event.target;
      if (path.nodeName === "path") {
        parentPath = d3.select(path.parentNode)[0][0].parentNode;
        pathId = this.findParentPathIndex(parentPath);
        if (!this.isShapeEditable(parentPath)) {
          return;
        }
        d3.select(parentPath).remove();
        linesVertexs.splice(pathId, 1);
        return lastLineIndex--;
      }
    };

    GraphPaper.prototype.getDrawingCoordinates = function(coord) {
      switch (currentDrawMode) {
        case "free":
          return coord;
        case "snapToGrid":
          return this.snapToGrid(coord);
        case "snapToIntersection":
          return this.snapToIntersection(coord);
      }
    };

    GraphPaper.prototype.snapToGrid = function(coord) {
      var bottomLine, factor, leftLine, realCoord, rightLine, topLine, x, y, _ref, _ref1, _ref2, _ref3;

      factor = 0.15;
      realCoord = this.posToRealPos(coord);
      leftLine = Math.floor(realCoord.x);
      rightLine = Math.ceil(realCoord.x);
      bottomLine = Math.floor(realCoord.y);
      topLine = Math.ceil(realCoord.y);
      x = coord.x;
      y = coord.y;
      if ((leftLine <= (_ref = realCoord.x) && _ref < (leftLine + factor))) {
        x = this.realXPosToPos(leftLine);
      } else if (((rightLine - factor) < (_ref1 = realCoord.x) && _ref1 <= rightLine)) {
        x = this.realXPosToPos(rightLine);
      }
      if ((bottomLine <= (_ref2 = realCoord.y) && _ref2 < (bottomLine + factor))) {
        y = this.realYPosToPos(bottomLine);
      } else if (((topLine - factor) < (_ref3 = realCoord.y) && _ref3 <= topLine)) {
        y = this.realYPosToPos(topLine);
      }
      return {
        x: x,
        y: y
      };
    };

    GraphPaper.prototype.snapToIntersection = function(coord) {
      var bottomLine, factor, leftLine, realCoord, rightLine, topLine, x, y, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;

      factor = 0.55;
      realCoord = this.posToRealPos(coord);
      leftLine = Math.floor(realCoord.x);
      rightLine = Math.ceil(realCoord.x);
      bottomLine = Math.floor(realCoord.y);
      topLine = Math.ceil(realCoord.y);
      x = coord.x;
      y = coord.y;
      if (((leftLine <= (_ref = realCoord.x) && _ref < (leftLine + factor))) && ((bottomLine <= (_ref1 = realCoord.y) && _ref1 < (bottomLine + factor)))) {
        x = this.realXPosToPos(leftLine);
        y = this.realYPosToPos(bottomLine);
      } else if (((leftLine <= (_ref2 = realCoord.x) && _ref2 < (leftLine + factor))) && (((topLine - factor) < (_ref3 = realCoord.y) && _ref3 <= topLine))) {
        x = this.realXPosToPos(leftLine);
        y = this.realYPosToPos(topLine);
      } else if ((((rightLine - factor) < (_ref4 = realCoord.x) && _ref4 <= rightLine)) && ((bottomLine <= (_ref5 = realCoord.y) && _ref5 < (bottomLine + factor)))) {
        x = this.realXPosToPos(rightLine);
        y = this.realYPosToPos(bottomLine);
      } else if ((((rightLine - factor) < (_ref6 = realCoord.x) && _ref6 <= rightLine)) && (((topLine - factor) < (_ref7 = realCoord.y) && _ref7 <= topLine))) {
        x = this.realXPosToPos(rightLine);
        y = this.realYPosToPos(topLine);
      }
      return {
        x: x,
        y: y
      };
    };

    GraphPaper.prototype.showVertexPointer = function(coord) {
      if (vertexPointer == null) {
        vertexPointer = linesTracer.append("circle").attr("class", "vertex-pointer");
      }
      return vertexPointer.attr("cx", coord.x).attr("cy", coord.y).attr("r", vertexSize).attr("style", "display:inline");
    };

    GraphPaper.prototype.hideVertexPointer = function() {
      if (vertexPointer != null) {
        return vertexPointer.attr("style", "display: none");
      }
    };

    GraphPaper.prototype.showVertexCoordinates = function(coord) {
      var realCoord;

      if (vertexCoordinates == null) {
        vertexCoordinates = linesTracer.append('text').attr("class", "vertex-coordinates");
      }
      realCoord = this.posToRealPos(coord);
      return vertexCoordinates.attr("x", coord.x + 7).attr("y", coord.y - 15).text("(" + realCoord.x + ", " + realCoord.y + ")").attr("style", "display:inline");
    };

    GraphPaper.prototype.hideVertexCoordinates = function() {
      if (vertexCoordinates != null) {
        return vertexCoordinates.attr("style", "display: none");
      }
    };

    GraphPaper.prototype.showLinePointer = function() {
      var cx, cy, lastVertex;

      if (linePointer == null) {
        linePointer = linesTracer.append("line").attr("class", "line-pointer");
      }
      lastVertex = linesVertexs[lastLineIndex].slice(-1)[0];
      cx = vertexPointer.attr("cx");
      cy = vertexPointer.attr("cy");
      return linePointer.attr("x1", lastVertex.x).attr("y1", lastVertex.y).attr("x2", cx).attr("y2", cy).attr("style", "display:inline");
    };

    GraphPaper.prototype.hideLinePointer = function() {
      if (linePointer != null) {
        return linePointer.attr("style", "display: none");
      }
    };

    GraphPaper.prototype.showPolygonPointer = function(coord) {
      var vertexList;

      vertexList = linesVertexs[lastLineIndex].slice(0);
      vertexList.push(coord);
      this.drawPolygon(lastLine, vertexList);
      return this.drawVertexs(lastLine, linesVertexs[lastLineIndex]);
    };

    GraphPaper.prototype.getEventCoordinates = function() {
      if (d3.event instanceof MouseEvent) {
        return {
          x: d3.mouse(node)[0],
          y: d3.mouse(node)[1]
        };
      } else if (d3.event instanceof TouchEvent) {
        return {
          x: d3.touches(node)[0][0],
          y: d3.touches(node)[0][1]
        };
      }
    };

    GraphPaper.prototype.findParentPathIndex = function(pathToFind) {
      var id, path, paths, _i, _len;

      paths = linesTracer.selectAll("g.path")[0];
      for (id = _i = 0, _len = paths.length; _i < _len; id = ++_i) {
        path = paths[id];
        if (pathToFind === path) {
          return id;
        }
      }
      return -1;
    };

    GraphPaper.prototype.getParentPathShapeType = function(parentPath) {
      if (d3.select(parentPath).classed("added-line") === true) {
        return "line";
      } else if (d3.select(parentPath).classed("added-polygon") === true) {
        return "polygon";
      }
    };

    GraphPaper.prototype.posToRealPos = function(coord) {
      var realX, realY;

      realX = this.truncateFloat((coord.x - origin.x) / gridSize);
      realY = this.truncateFloat((origin.y - coord.y) / gridSize);
      return {
        x: realX,
        y: realY
      };
    };

    GraphPaper.prototype.realPosToPos = function(realCoord) {
      return {
        x: this.realXPosToPos(realCoord.x),
        y: this.realYPosToPos(realCoord.y)
      };
    };

    GraphPaper.prototype.realXPosToPos = function(realXPos) {
      return realXPos * gridSize + origin.x;
    };

    GraphPaper.prototype.realYPosToPos = function(realYPos) {
      return origin.y - realYPos * gridSize;
    };

    GraphPaper.prototype.truncateFloat = function(number) {
      return Math.round(number * 10) / 10;
    };

    GraphPaper.prototype.moveOrigin = function(x, y) {
      var invertedY;

      invertedY = -1 * y;
      return svg.attr('transform', 'translate(' + x + ',' + invertedY + ')');
    };

    GraphPaper.prototype.isShapeEditable = function(path) {
      return !(d3.select(path).classed("initial-shape") === true && initialPathEditable === false);
    };

    GraphPaper.prototype.getAllShapes = function() {
      var id, result, shape, shapeType, _i, _j, _len, _len1, _ref;

      result = {
        vertexs: [],
        lines: [],
        polygons: []
      };
      for (id = _i = 0, _len = linesVertexs.length; _i < _len; id = ++_i) {
        shape = linesVertexs[id];
        if (shape.length !== 0) {
          _ref = ["vertex", "line", "polygon"];
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            shapeType = _ref[_j];
            if (d3.select(paths[id]).classed("added-" + shapeType)) {
              if (shapeType === "vertex") {
                result[shapeType + "s"].push(shape[0]);
              } else {
                result[shapeType + "s"].push(shape);
              }
              break;
            }
          }
        }
      }
      return result;
    };

    GraphPaper.prototype.getAddedShapes = function() {
      var path, pathId, paths, result, shapeType, _i, _j, _len, _len1, _ref;

      paths = linesTracer.selectAll("g.path:not(.initial-shape)")[0];
      result = {
        vertexs: [],
        lines: [],
        polygons: []
      };
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        pathId = this.findParentPathIndex(path);
        _ref = ["vertex", "line", "polygon"];
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          shapeType = _ref[_j];
          if (d3.select(path).classed("added-" + shapeType)) {
            if (shapeType === "vertex") {
              result[shapeType + "s"].push(linesVertexs[pathId][0]);
            } else {
              result[shapeType + "s"].push(linesVertexs[pathId]);
            }
            break;
          }
        }
      }
      return result;
    };

    GraphPaper.prototype.addInitialVertex = function(vertexs) {
      var lastVertex, vertex, _i, _len, _results;

      _results = [];
      for (_i = 0, _len = vertexs.length; _i < _len; _i++) {
        vertex = vertexs[_i];
        if (linesVertexs[lastLineIndex].length !== 0) {
          linesVertexs.push([]);
          lastLineIndex++;
        }
        linesVertexs[lastLineIndex].push(this.realPosToPos(vertex));
        lastVertex = linesTracer.append("g").attr("class", "path added-vertex initial-shape");
        this.drawVertexs(lastVertex, [this.realPosToPos(vertex)]);
        linesVertexs.push([]);
        _results.push(lastLineIndex++);
      }
      return _results;
    };

    GraphPaper.prototype.addInitialPath = function(paths, pathType) {
      var path, vertex, vertexs, _i, _j, _len, _len1, _results;

      _results = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        vertexs = [];
        if (linesVertexs[lastLineIndex].length !== 0) {
          linesVertexs.push([]);
          lastLineIndex++;
        }
        for (_j = 0, _len1 = path.length; _j < _len1; _j++) {
          vertex = path[_j];
          vertexs.push(this.realPosToPos(vertex));
        }
        linesVertexs[lastLineIndex] = vertexs;
        this.drawInitialPath(vertexs, pathType);
        linesVertexs.push([]);
        _results.push(lastLineIndex++);
      }
      return _results;
    };

    GraphPaper.prototype.drawInitialPath = function(vertexs, pathType) {
      if (pathType === "line") {
        lastLine = linesTracer.append("g").attr("class", "path added-line initial-shape");
        this.drawLine(lastLine, vertexs);
      } else if (pathType === "polygon") {
        lastLine = linesTracer.append("g").attr("class", "path added-polygon initial-shape");
        this.drawPolygon(lastLine, vertexs);
      }
      return this.drawVertexs(lastLine, vertexs);
    };

    GraphPaper.prototype.addShapes = function(shapes) {
      if (shapes.vertexs != null) {
        this.addInitialVertex(shapes.vertexs);
      }
      if (shapes.lines != null) {
        this.addInitialPath(shapes.lines, "line");
      }
      if (shapes.polygons != null) {
        return this.addInitialPath(shapes.polygons, "polygon");
      }
    };

    GraphPaper.prototype.registerSVGEvent = function(eventName, callback) {
      if (registeredEvent[eventName] == null) {
        svg.on(eventName, this.fireCallback);
        registeredEvent[eventName] = [];
      }
      return registeredEvent[eventName].push(callback);
    };

    GraphPaper.prototype.unregisterSVGEvent = function(eventName, callback) {
      var callbackIndex;

      if (registeredEvent[eventName] != null) {
        callbackIndex = registeredEvent[eventName].indexOf(callback);
        if (callbackIndex !== -1) {
          if (registeredEvent[eventName].lenght >= 2) {
            return registeredEvent[eventName].splice(callbackIndex, 1);
          } else {
            delete registeredEvent[eventName];
            return svg.on(eventName, null);
          }
        }
      }
    };

    GraphPaper.prototype.fireCallback = function() {
      var callback, eventType, _i, _len, _ref, _results;

      eventType = d3.event.type;
      _ref = registeredEvent[eventType];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        _results.push(callback());
      }
      return _results;
    };

    GraphPaper.prototype.setDrawingMode = function(mode) {
      if (__indexOf.call(drawModes, mode) >= 0) {
        return currentDrawMode = mode;
      }
    };

    GraphPaper.prototype.setTool = function(tool) {
      if (__indexOf.call(tools, tool) >= 0) {
        return currentTool = tool;
      }
    };

    GraphPaper.prototype.setInitialPathEditable = function(isEditable) {
      return initialPathEditable = isEditable;
    };

    return GraphPaper;

  })();

}).call(this);

/* parser generated by jison 0.4.4 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var EquationEvaluator = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"expressions":3,"e":4,"EOF":5,"literal":6,"additive_expression":7,"multiplicative_expression":8,"function_expression":9,"exponent_expression":10,"factorial_expression":11,"parenthesis_expression":12,"E":13,"PI":14,"NUMBER":15,"-":16,"%":17,"+":18,"*":19,"/":20,"SQUARE":21,"ABS":22,"LOG":23,"LN":24,"SIN":25,"COS":26,"TAN":27,"ARCSIN":28,"ARCCOS":29,"ARCTAN":30,"^":31,"EXPOSANT":32,"!":33,"(":34,")":35,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",13:"E",14:"PI",15:"NUMBER",16:"-",17:"%",18:"+",19:"*",20:"/",21:"SQUARE",22:"ABS",23:"LOG",24:"LN",25:"SIN",26:"COS",27:"TAN",28:"ARCSIN",29:"ARCCOS",30:"ARCTAN",31:"^",32:"EXPOSANT",33:"!",34:"(",35:")"},
productions_: [0,[3,2],[4,1],[4,1],[4,1],[4,1],[4,1],[4,1],[4,1],[6,1],[6,1],[6,1],[6,2],[6,2],[7,3],[7,3],[8,3],[8,3],[8,2],[8,2],[9,2],[9,2],[9,2],[9,2],[9,2],[9,2],[9,2],[9,2],[9,2],[9,2],[10,3],[10,2],[11,2],[12,3]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:return $$[$0-1];
break;
case 9:this.$ = Math.E;
break;
case 10:this.$ = Math.PI;
break;
case 11:this.$ = Number(yytext);
break;
case 12:this.$ = -$$[$0];
break;
case 13:this.$ = $$[$0-1] / 100;
break;
case 14:this.$ = $$[$0-2] + $$[$0];
break;
case 15:this.$ = $$[$0-2] - $$[$0];
break;
case 16:this.$ = $$[$0-2] * $$[$0];
break;
case 17:this.$ = $$[$0-2] / $$[$0];
break;
case 18:this.$ = $$[$0-1] * $$[$0];
break;
case 19:this.$ = $$[$0-1] * $$[$0];
break;
case 20:this.$ = Math.sqrt($$[$0]);
break;
case 21:this.$ = Math.abs($$[$0]);
break;
case 22:this.$ = Math.log($$[$0]);
break;
case 23:this.$ = Math.log($$[$0]) / Math.log(Math.E);
break;
case 24:this.$ = Math.sin($$[$0]);
break;
case 25:this.$ = Math.cos($$[$0]);
break;
case 26:this.$ = Math.tan($$[$0]);
break;
case 27:this.$ = Math.asin($$[$0]);
break;
case 28:this.$ = Math.acos($$[$0]);
break;
case 29:this.$ = Math.atan($$[$0]);
break;
case 30:this.$ = Math.pow($$[$0-2], $$[$0]);
break;
case 31:
            var exposants = ['⁰','¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹'];
            var exposant = "";
            for(var i = 0; i < $$[$0].length; i++)
              exposant += exposants.indexOf($$[$0].charAt(i));
            this.$ = Math.pow($$[$0-1], exposant);
        
break;
case 32:this.$ = (function fact (n) { return n==0 ? 1 : fact(n-1) * n })($$[$0-1]);
break;
case 33: this.$ = $$[$0-1];
break;
}
},
table: [{3:1,4:2,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:[1,10],14:[1,11],15:[1,12],16:[1,13],21:[1,14],22:[1,15],23:[1,16],24:[1,17],25:[1,18],26:[1,19],27:[1,20],28:[1,21],29:[1,22],30:[1,23],34:[1,24]},{1:[3]},{5:[1,25],9:30,12:31,16:[1,27],18:[1,26],19:[1,28],20:[1,29],21:[1,14],22:[1,15],23:[1,16],24:[1,17],25:[1,18],26:[1,19],27:[1,20],28:[1,21],29:[1,22],30:[1,23],31:[1,32],32:[1,33],33:[1,34],34:[1,24]},{5:[2,2],16:[2,2],18:[2,2],19:[2,2],20:[2,2],21:[2,2],22:[2,2],23:[2,2],24:[2,2],25:[2,2],26:[2,2],27:[2,2],28:[2,2],29:[2,2],30:[2,2],31:[2,2],32:[2,2],33:[2,2],34:[2,2],35:[2,2]},{5:[2,3],16:[2,3],18:[2,3],19:[2,3],20:[2,3],21:[2,3],22:[2,3],23:[2,3],24:[2,3],25:[2,3],26:[2,3],27:[2,3],28:[2,3],29:[2,3],30:[2,3],31:[2,3],32:[2,3],33:[2,3],34:[2,3],35:[2,3]},{5:[2,4],16:[2,4],18:[2,4],19:[2,4],20:[2,4],21:[2,4],22:[2,4],23:[2,4],24:[2,4],25:[2,4],26:[2,4],27:[2,4],28:[2,4],29:[2,4],30:[2,4],31:[2,4],32:[2,4],33:[2,4],34:[2,4],35:[2,4]},{5:[2,5],16:[2,5],18:[2,5],19:[2,5],20:[2,5],21:[2,5],22:[2,5],23:[2,5],24:[2,5],25:[2,5],26:[2,5],27:[2,5],28:[2,5],29:[2,5],30:[2,5],31:[2,5],32:[2,5],33:[2,5],34:[2,5],35:[2,5]},{5:[2,6],16:[2,6],18:[2,6],19:[2,6],20:[2,6],21:[2,6],22:[2,6],23:[2,6],24:[2,6],25:[2,6],26:[2,6],27:[2,6],28:[2,6],29:[2,6],30:[2,6],31:[2,6],32:[2,6],33:[2,6],34:[2,6],35:[2,6]},{5:[2,7],16:[2,7],18:[2,7],19:[2,7],20:[2,7],21:[2,7],22:[2,7],23:[2,7],24:[2,7],25:[2,7],26:[2,7],27:[2,7],28:[2,7],29:[2,7],30:[2,7],31:[2,7],32:[2,7],33:[2,7],34:[2,7],35:[2,7]},{5:[2,8],16:[2,8],18:[2,8],19:[2,8],20:[2,8],21:[2,8],22:[2,8],23:[2,8],24:[2,8],25:[2,8],26:[2,8],27:[2,8],28:[2,8],29:[2,8],30:[2,8],31:[2,8],32:[2,8],33:[2,8],34:[2,8],35:[2,8]},{5:[2,9],16:[2,9],18:[2,9],19:[2,9],20:[2,9],21:[2,9],22:[2,9],23:[2,9],24:[2,9],25:[2,9],26:[2,9],27:[2,9],28:[2,9],29:[2,9],30:[2,9],31:[2,9],32:[2,9],33:[2,9],34:[2,9],35:[2,9]},{5:[2,10],16:[2,10],18:[2,10],19:[2,10],20:[2,10],21:[2,10],22:[2,10],23:[2,10],24:[2,10],25:[2,10],26:[2,10],27:[2,10],28:[2,10],29:[2,10],30:[2,10],31:[2,10],32:[2,10],33:[2,10],34:[2,10],35:[2,10]},{5:[2,11],16:[2,11],17:[1,35],18:[2,11],19:[2,11],20:[2,11],21:[2,11],22:[2,11],23:[2,11],24:[2,11],25:[2,11],26:[2,11],27:[2,11],28:[2,11],29:[2,11],30:[2,11],31:[2,11],32:[2,11],33:[2,11],34:[2,11],35:[2,11]},{4:36,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:[1,10],14:[1,11],15:[1,12],16:[1,13],21:[1,14],22:[1,15],23:[1,16],24:[1,17],25:[1,18],26:[1,19],27:[1,20],28:[1,21],29:[1,22],30:[1,23],34:[1,24]},{12:37,34:[1,24]},{12:38,34:[1,24]},{12:39,34:[1,24]},{12:40,34:[1,24]},{12:41,34:[1,24]},{12:42,34:[1,24]},{12:43,34:[1,24]},{12:44,34:[1,24]},{12:45,34:[1,24]},{12:46,34:[1,24]},{4:47,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:[1,10],14:[1,11],15:[1,12],16:[1,13],21:[1,14],22:[1,15],23:[1,16],24:[1,17],25:[1,18],26:[1,19],27:[1,20],28:[1,21],29:[1,22],30:[1,23],34:[1,24]},{1:[2,1]},{4:48,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:[1,10],14:[1,11],15:[1,12],16:[1,13],21:[1,14],22:[1,15],23:[1,16],24:[1,17],25:[1,18],26:[1,19],27:[1,20],28:[1,21],29:[1,22],30:[1,23],34:[1,24]},{4:49,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:[1,10],14:[1,11],15:[1,12],16:[1,13],21:[1,14],22:[1,15],23:[1,16],24:[1,17],25:[1,18],26:[1,19],27:[1,20],28:[1,21],29:[1,22],30:[1,23],34:[1,24]},{4:50,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:[1,10],14:[1,11],15:[1,12],16:[1,13],21:[1,14],22:[1,15],23:[1,16],24:[1,17],25:[1,18],26:[1,19],27:[1,20],28:[1,21],29:[1,22],30:[1,23],34:[1,24]},{4:51,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:[1,10],14:[1,11],15:[1,12],16:[1,13],21:[1,14],22:[1,15],23:[1,16],24:[1,17],25:[1,18],26:[1,19],27:[1,20],28:[1,21],29:[1,22],30:[1,23],34:[1,24]},{5:[2,18],16:[2,18],18:[2,18],19:[2,18],20:[2,18],21:[2,18],22:[2,18],23:[2,18],24:[2,18],25:[2,18],26:[2,18],27:[2,18],28:[2,18],29:[2,18],30:[2,18],31:[2,18],32:[2,18],33:[2,18],34:[2,18],35:[2,18]},{5:[2,19],16:[2,19],18:[2,19],19:[2,19],20:[2,19],21:[2,19],22:[2,19],23:[2,19],24:[2,19],25:[2,19],26:[2,19],27:[2,19],28:[2,19],29:[2,19],30:[2,19],31:[2,19],32:[2,19],33:[2,19],34:[2,19],35:[2,19]},{12:52,34:[1,24]},{5:[2,31],16:[2,31],18:[2,31],19:[2,31],20:[2,31],21:[2,31],22:[2,31],23:[2,31],24:[2,31],25:[2,31],26:[2,31],27:[2,31],28:[2,31],29:[2,31],30:[2,31],31:[2,31],32:[2,31],33:[2,31],34:[2,31],35:[2,31]},{5:[2,32],16:[2,32],18:[2,32],19:[2,32],20:[2,32],21:[2,32],22:[2,32],23:[2,32],24:[2,32],25:[2,32],26:[2,32],27:[2,32],28:[2,32],29:[2,32],30:[2,32],31:[2,32],32:[2,32],33:[2,32],34:[2,32],35:[2,32]},{5:[2,13],16:[2,13],18:[2,13],19:[2,13],20:[2,13],21:[2,13],22:[2,13],23:[2,13],24:[2,13],25:[2,13],26:[2,13],27:[2,13],28:[2,13],29:[2,13],30:[2,13],31:[2,13],32:[2,13],33:[2,13],34:[2,13],35:[2,13]},{5:[2,12],9:30,12:31,16:[2,12],18:[2,12],19:[2,12],20:[2,12],21:[2,12],22:[2,12],23:[2,12],24:[2,12],25:[2,12],26:[2,12],27:[2,12],28:[2,12],29:[2,12],30:[2,12],31:[2,12],32:[2,12],33:[2,12],34:[1,24],35:[2,12]},{5:[2,20],16:[2,20],18:[2,20],19:[2,20],20:[2,20],21:[2,20],22:[2,20],23:[2,20],24:[2,20],25:[2,20],26:[2,20],27:[2,20],28:[2,20],29:[2,20],30:[2,20],31:[2,20],32:[2,20],33:[2,20],34:[2,20],35:[2,20]},{5:[2,21],16:[2,21],18:[2,21],19:[2,21],20:[2,21],21:[2,21],22:[2,21],23:[2,21],24:[2,21],25:[2,21],26:[2,21],27:[2,21],28:[2,21],29:[2,21],30:[2,21],31:[2,21],32:[2,21],33:[2,21],34:[2,21],35:[2,21]},{5:[2,22],16:[2,22],18:[2,22],19:[2,22],20:[2,22],21:[2,22],22:[2,22],23:[2,22],24:[2,22],25:[2,22],26:[2,22],27:[2,22],28:[2,22],29:[2,22],30:[2,22],31:[2,22],32:[2,22],33:[2,22],34:[2,22],35:[2,22]},{5:[2,23],16:[2,23],18:[2,23],19:[2,23],20:[2,23],21:[2,23],22:[2,23],23:[2,23],24:[2,23],25:[2,23],26:[2,23],27:[2,23],28:[2,23],29:[2,23],30:[2,23],31:[2,23],32:[2,23],33:[2,23],34:[2,23],35:[2,23]},{5:[2,24],16:[2,24],18:[2,24],19:[2,24],20:[2,24],21:[2,24],22:[2,24],23:[2,24],24:[2,24],25:[2,24],26:[2,24],27:[2,24],28:[2,24],29:[2,24],30:[2,24],31:[2,24],32:[2,24],33:[2,24],34:[2,24],35:[2,24]},{5:[2,25],16:[2,25],18:[2,25],19:[2,25],20:[2,25],21:[2,25],22:[2,25],23:[2,25],24:[2,25],25:[2,25],26:[2,25],27:[2,25],28:[2,25],29:[2,25],30:[2,25],31:[2,25],32:[2,25],33:[2,25],34:[2,25],35:[2,25]},{5:[2,26],16:[2,26],18:[2,26],19:[2,26],20:[2,26],21:[2,26],22:[2,26],23:[2,26],24:[2,26],25:[2,26],26:[2,26],27:[2,26],28:[2,26],29:[2,26],30:[2,26],31:[2,26],32:[2,26],33:[2,26],34:[2,26],35:[2,26]},{5:[2,27],16:[2,27],18:[2,27],19:[2,27],20:[2,27],21:[2,27],22:[2,27],23:[2,27],24:[2,27],25:[2,27],26:[2,27],27:[2,27],28:[2,27],29:[2,27],30:[2,27],31:[2,27],32:[2,27],33:[2,27],34:[2,27],35:[2,27]},{5:[2,28],16:[2,28],18:[2,28],19:[2,28],20:[2,28],21:[2,28],22:[2,28],23:[2,28],24:[2,28],25:[2,28],26:[2,28],27:[2,28],28:[2,28],29:[2,28],30:[2,28],31:[2,28],32:[2,28],33:[2,28],34:[2,28],35:[2,28]},{5:[2,29],16:[2,29],18:[2,29],19:[2,29],20:[2,29],21:[2,29],22:[2,29],23:[2,29],24:[2,29],25:[2,29],26:[2,29],27:[2,29],28:[2,29],29:[2,29],30:[2,29],31:[2,29],32:[2,29],33:[2,29],34:[2,29],35:[2,29]},{9:30,12:31,16:[1,27],18:[1,26],19:[1,28],20:[1,29],21:[1,14],22:[1,15],23:[1,16],24:[1,17],25:[1,18],26:[1,19],27:[1,20],28:[1,21],29:[1,22],30:[1,23],31:[1,32],32:[1,33],33:[1,34],34:[1,24],35:[1,53]},{5:[2,14],9:30,12:31,16:[2,14],18:[2,14],19:[1,28],20:[1,29],21:[1,14],22:[1,15],23:[1,16],24:[1,17],25:[1,18],26:[1,19],27:[1,20],28:[1,21],29:[1,22],30:[1,23],31:[1,32],32:[1,33],33:[1,34],34:[1,24],35:[2,14]},{5:[2,15],9:30,12:31,16:[2,15],18:[2,15],19:[1,28],20:[1,29],21:[1,14],22:[1,15],23:[1,16],24:[1,17],25:[1,18],26:[1,19],27:[1,20],28:[1,21],29:[1,22],30:[1,23],31:[1,32],32:[1,33],33:[1,34],34:[1,24],35:[2,15]},{5:[2,16],9:30,12:31,16:[2,16],18:[2,16],19:[2,16],20:[2,16],21:[1,14],22:[1,15],23:[1,16],24:[1,17],25:[1,18],26:[1,19],27:[1,20],28:[1,21],29:[1,22],30:[1,23],31:[1,32],32:[1,33],33:[1,34],34:[1,24],35:[2,16]},{5:[2,17],9:30,12:31,16:[2,17],18:[2,17],19:[2,17],20:[2,17],21:[1,14],22:[1,15],23:[1,16],24:[1,17],25:[1,18],26:[1,19],27:[1,20],28:[1,21],29:[1,22],30:[1,23],31:[1,32],32:[1,33],33:[1,34],34:[1,24],35:[2,17]},{5:[2,30],16:[2,30],18:[2,30],19:[2,30],20:[2,30],21:[2,30],22:[2,30],23:[2,30],24:[2,30],25:[2,30],26:[2,30],27:[2,30],28:[2,30],29:[2,30],30:[2,30],31:[2,30],32:[2,30],33:[2,30],34:[2,30],35:[2,30]},{5:[2,33],16:[2,33],18:[2,33],19:[2,33],20:[2,33],21:[2,33],22:[2,33],23:[2,33],24:[2,33],25:[2,33],26:[2,33],27:[2,33],28:[2,33],29:[2,33],30:[2,33],31:[2,33],32:[2,33],33:[2,33],34:[2,33],35:[2,33]}],
defaultActions: {25:[2,1]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        throw new Error(str);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == 'undefined') {
        this.lexer.yylloc = {};
    }
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === 'function') {
        this.parseError = this.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || EOF;
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + this.lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: this.lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: this.lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
undefined/* generated by jison-lex 0.2.0 */
var lexer = (function(){
var lexer = {

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input) {
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            if (this.options.backtrack_lexer) {
                delete backup;
            }
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        if (this.options.backtrack_lexer) {
            delete backup;
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* skip whitespace */
break;
case 1:return 15
break;
case 2:return 19
break;
case 3:return 20
break;
case 4:return 16
break;
case 5:return 18
break;
case 6:return 31
break;
case 7:return ','
break;
case 8:return 14
break;
case 9:return 14
break;
case 10:return 14
break;
case 11:return 32
break;
case 12:return 22
break;
case 13:return 34
break;
case 14:return 35
break;
case 15:return 13
break;
case 16:return 13
break;
case 17:return 21
break;
case 18:return 21
break;
case 19:return 23
break;
case 20:return 24
break;
case 21:return 33
break;
case 22:return 17
break;
case 23:return 25
break;
case 24:return 26
break;
case 25:return 27
break;
case 26:return 28
break;
case 27:return 29
break;
case 28:return 30
break;
case 29:return 5
break;
case 30:return 'INVALID'
break;
}
},
rules: [/^(?:\s+)/,/^(?:\d+([.]\d+)?\b)/,/^(?:\*)/,/^(?:\/)/,/^(?:-)/,/^(?:\+)/,/^(?:\^)/,/^(?:,)/,/^(?:PI\b)/,/^(?:Pi\b)/,/^(?:pi\b)/,/^(?:[⁰|¹|²|³|⁴|⁵|⁶|⁷|⁸|⁹]+)/,/^(?:abs\b)/,/^(?:\()/,/^(?:\))/,/^(?:E\b)/,/^(?:e\b)/,/^(?:sqrt\b)/,/^(?:racine de\b)/,/^(?:log\b)/,/^(?:ln\b)/,/^(?:!)/,/^(?:%)/,/^(?:sin\b)/,/^(?:cos\b)/,/^(?:tan\b)/,/^(?:arcsin\b)/,/^(?:arccos\b)/,/^(?:arctan\b)/,/^(?:$)/,/^(?:.)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],"inclusive":true}}
};
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = EquationEvaluator;
exports.Parser = EquationEvaluator.Parser;
exports.parse = function () { return EquationEvaluator.parse.apply(EquationEvaluator, arguments); };
exports.main = function commonjsMain(args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
/* parser generated by jison 0.4.4 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var EquationToLaTex = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"expressions":3,"e":4,"EOF":5,"literal":6,"variable":7,"additive_expression":8,"multiplicative_expression":9,"function_expression":10,"exponent_expression":11,"logical_operator":12,"factorial_expression":13,"parenthesis_expression":14,"NUMBER":15,"%":16,"-":17,"SYMBOL":18,"VAR":19,"VAR_INDEX":20,"+":21,"*":22,"/":23,"FUNCTION":24,"SQUARE":25,"(":26,")":27,"ABS":28,"EQUAL":29,"NOT_EQUAL":30,"GREATER_THAN":31,"GREATER_THAN_OR_EQUAL":32,"LESSER_THAN":33,"LESSER_THAN_OR_EQUAL":34,"^":35,"EXPOSANT":36,"!":37,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",15:"NUMBER",16:"%",17:"-",18:"SYMBOL",19:"VAR",20:"VAR_INDEX",21:"+",22:"*",23:"/",24:"FUNCTION",25:"SQUARE",26:"(",27:")",28:"ABS",29:"EQUAL",30:"NOT_EQUAL",31:"GREATER_THAN",32:"GREATER_THAN_OR_EQUAL",33:"LESSER_THAN",34:"LESSER_THAN_OR_EQUAL",35:"^",36:"EXPOSANT",37:"!"},
productions_: [0,[3,2],[4,1],[4,1],[4,1],[4,1],[4,1],[4,1],[4,1],[4,1],[4,1],[6,1],[6,2],[6,2],[6,1],[7,1],[7,1],[8,3],[8,3],[9,3],[9,3],[9,2],[9,2],[10,2],[10,4],[10,4],[12,3],[12,3],[12,3],[12,3],[12,3],[12,3],[11,5],[11,2],[13,2],[14,3]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1: return $$[$0-1]; 
break;
case 11:this.$ = yytext;
break;
case 12:this.$ = "" + $$[$0-1] + "\\%";
break;
case 13:this.$ = "-" + $$[$0];
break;
case 14:this.$ = "\\" + yytext;
break;
case 15:this.$ = yytext;
break;
case 16:this.$ = yytext;
break;
case 17:this.$ = "" + $$[$0-2] + "+" + $$[$0];
break;
case 18:this.$ = "" + $$[$0-2] + "-" + $$[$0];
break;
case 19:this.$ = $$[$0-2] + "\\times " + $$[$0];
break;
case 20:this.$ = "\\frac{" + $$[$0-2] + "}{" + $$[$0] + "}";
break;
case 21:this.$ = $$[$0-1] + $$[$0];
break;
case 22:this.$ = $$[$0-1] + $$[$0];
break;
case 23:this.$ = "\\" + $$[$0-1] +  " " + $$[$0];
break;
case 24:this.$ = "\\sqrt{" + $$[$0-1] +"}";
break;
case 25:this.$ = "\\left\|" + $$[$0-1] + "\\right\|";
break;
case 26:this.$ = $$[$0-2] + "=" + $$[$0];
break;
case 27:this.$ = $$[$0-2] + "\\neq " + $$[$0];
break;
case 28:this.$ = $$[$0-2] + ">" + $$[$0];
break;
case 29:this.$ = $$[$0-2] + "\\geq " + $$[$0];
break;
case 30:this.$ = $$[$0-2] + "<" + $$[$0];
break;
case 31:this.$ = $$[$0-2] + "\\leq " + $$[$0];
break;
case 32:this.$ = "" + $$[$0-4] + "^{" + $$[$0-1] + "}";
break;
case 33:
            var exposants = ['⁰','¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹'];
            var exposant = "";
            for(var i = 0; i < $$[$0].length; i++)
              exposant += exposants.indexOf($$[$0].charAt(i));
            this.$ = "" + $$[$0-1] + "^{" + exposant + "}";
        
break;
case 34:this.$ = "" + $$[$0-1] + "!";
break;
case 35:this.$ = "(" + $$[$0-1] + ")";
break;
}
},
table: [{3:1,4:2,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:[1,12],17:[1,13],18:[1,14],19:[1,15],20:[1,16],24:[1,17],25:[1,18],26:[1,20],28:[1,19]},{1:[3]},{5:[1,21],10:26,14:27,17:[1,23],21:[1,22],22:[1,24],23:[1,25],24:[1,17],25:[1,18],26:[1,20],28:[1,19],29:[1,30],30:[1,31],31:[1,32],32:[1,33],33:[1,34],34:[1,35],35:[1,28],36:[1,29],37:[1,36]},{5:[2,2],17:[2,2],21:[2,2],22:[2,2],23:[2,2],24:[2,2],25:[2,2],26:[2,2],27:[2,2],28:[2,2],29:[2,2],30:[2,2],31:[2,2],32:[2,2],33:[2,2],34:[2,2],35:[2,2],36:[2,2],37:[2,2]},{5:[2,3],17:[2,3],21:[2,3],22:[2,3],23:[2,3],24:[2,3],25:[2,3],26:[2,3],27:[2,3],28:[2,3],29:[2,3],30:[2,3],31:[2,3],32:[2,3],33:[2,3],34:[2,3],35:[2,3],36:[2,3],37:[2,3]},{5:[2,4],17:[2,4],21:[2,4],22:[2,4],23:[2,4],24:[2,4],25:[2,4],26:[2,4],27:[2,4],28:[2,4],29:[2,4],30:[2,4],31:[2,4],32:[2,4],33:[2,4],34:[2,4],35:[2,4],36:[2,4],37:[2,4]},{5:[2,5],17:[2,5],21:[2,5],22:[2,5],23:[2,5],24:[2,5],25:[2,5],26:[2,5],27:[2,5],28:[2,5],29:[2,5],30:[2,5],31:[2,5],32:[2,5],33:[2,5],34:[2,5],35:[2,5],36:[2,5],37:[2,5]},{5:[2,6],17:[2,6],21:[2,6],22:[2,6],23:[2,6],24:[2,6],25:[2,6],26:[2,6],27:[2,6],28:[2,6],29:[2,6],30:[2,6],31:[2,6],32:[2,6],33:[2,6],34:[2,6],35:[2,6],36:[2,6],37:[2,6]},{5:[2,7],17:[2,7],21:[2,7],22:[2,7],23:[2,7],24:[2,7],25:[2,7],26:[2,7],27:[2,7],28:[2,7],29:[2,7],30:[2,7],31:[2,7],32:[2,7],33:[2,7],34:[2,7],35:[2,7],36:[2,7],37:[2,7]},{5:[2,8],17:[2,8],21:[2,8],22:[2,8],23:[2,8],24:[2,8],25:[2,8],26:[2,8],27:[2,8],28:[2,8],29:[2,8],30:[2,8],31:[2,8],32:[2,8],33:[2,8],34:[2,8],35:[2,8],36:[2,8],37:[2,8]},{5:[2,9],17:[2,9],21:[2,9],22:[2,9],23:[2,9],24:[2,9],25:[2,9],26:[2,9],27:[2,9],28:[2,9],29:[2,9],30:[2,9],31:[2,9],32:[2,9],33:[2,9],34:[2,9],35:[2,9],36:[2,9],37:[2,9]},{5:[2,10],17:[2,10],21:[2,10],22:[2,10],23:[2,10],24:[2,10],25:[2,10],26:[2,10],27:[2,10],28:[2,10],29:[2,10],30:[2,10],31:[2,10],32:[2,10],33:[2,10],34:[2,10],35:[2,10],36:[2,10],37:[2,10]},{5:[2,11],16:[1,37],17:[2,11],21:[2,11],22:[2,11],23:[2,11],24:[2,11],25:[2,11],26:[2,11],27:[2,11],28:[2,11],29:[2,11],30:[2,11],31:[2,11],32:[2,11],33:[2,11],34:[2,11],35:[2,11],36:[2,11],37:[2,11]},{4:38,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:[1,12],17:[1,13],18:[1,14],19:[1,15],20:[1,16],24:[1,17],25:[1,18],26:[1,20],28:[1,19]},{5:[2,14],17:[2,14],21:[2,14],22:[2,14],23:[2,14],24:[2,14],25:[2,14],26:[2,14],27:[2,14],28:[2,14],29:[2,14],30:[2,14],31:[2,14],32:[2,14],33:[2,14],34:[2,14],35:[2,14],36:[2,14],37:[2,14]},{5:[2,15],17:[2,15],21:[2,15],22:[2,15],23:[2,15],24:[2,15],25:[2,15],26:[2,15],27:[2,15],28:[2,15],29:[2,15],30:[2,15],31:[2,15],32:[2,15],33:[2,15],34:[2,15],35:[2,15],36:[2,15],37:[2,15]},{5:[2,16],17:[2,16],21:[2,16],22:[2,16],23:[2,16],24:[2,16],25:[2,16],26:[2,16],27:[2,16],28:[2,16],29:[2,16],30:[2,16],31:[2,16],32:[2,16],33:[2,16],34:[2,16],35:[2,16],36:[2,16],37:[2,16]},{14:39,26:[1,20]},{26:[1,40]},{26:[1,41]},{4:42,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:[1,12],17:[1,13],18:[1,14],19:[1,15],20:[1,16],24:[1,17],25:[1,18],26:[1,20],28:[1,19]},{1:[2,1]},{4:43,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:[1,12],17:[1,13],18:[1,14],19:[1,15],20:[1,16],24:[1,17],25:[1,18],26:[1,20],28:[1,19]},{4:44,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:[1,12],17:[1,13],18:[1,14],19:[1,15],20:[1,16],24:[1,17],25:[1,18],26:[1,20],28:[1,19]},{4:45,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:[1,12],17:[1,13],18:[1,14],19:[1,15],20:[1,16],24:[1,17],25:[1,18],26:[1,20],28:[1,19]},{4:46,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:[1,12],17:[1,13],18:[1,14],19:[1,15],20:[1,16],24:[1,17],25:[1,18],26:[1,20],28:[1,19]},{5:[2,21],17:[2,21],21:[2,21],22:[2,21],23:[2,21],24:[2,21],25:[2,21],26:[2,21],27:[2,21],28:[2,21],29:[2,21],30:[2,21],31:[2,21],32:[2,21],33:[2,21],34:[2,21],35:[2,21],36:[2,21],37:[2,21]},{5:[2,22],17:[2,22],21:[2,22],22:[2,22],23:[2,22],24:[2,22],25:[2,22],26:[2,22],27:[2,22],28:[2,22],29:[2,22],30:[2,22],31:[2,22],32:[2,22],33:[2,22],34:[2,22],35:[2,22],36:[2,22],37:[2,22]},{26:[1,47]},{5:[2,33],17:[2,33],21:[2,33],22:[2,33],23:[2,33],24:[2,33],25:[2,33],26:[2,33],27:[2,33],28:[2,33],29:[2,33],30:[2,33],31:[2,33],32:[2,33],33:[2,33],34:[2,33],35:[2,33],36:[2,33],37:[2,33]},{4:48,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:[1,12],17:[1,13],18:[1,14],19:[1,15],20:[1,16],24:[1,17],25:[1,18],26:[1,20],28:[1,19]},{4:49,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:[1,12],17:[1,13],18:[1,14],19:[1,15],20:[1,16],24:[1,17],25:[1,18],26:[1,20],28:[1,19]},{4:50,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:[1,12],17:[1,13],18:[1,14],19:[1,15],20:[1,16],24:[1,17],25:[1,18],26:[1,20],28:[1,19]},{4:51,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:[1,12],17:[1,13],18:[1,14],19:[1,15],20:[1,16],24:[1,17],25:[1,18],26:[1,20],28:[1,19]},{4:52,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:[1,12],17:[1,13],18:[1,14],19:[1,15],20:[1,16],24:[1,17],25:[1,18],26:[1,20],28:[1,19]},{4:53,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:[1,12],17:[1,13],18:[1,14],19:[1,15],20:[1,16],24:[1,17],25:[1,18],26:[1,20],28:[1,19]},{5:[2,34],17:[2,34],21:[2,34],22:[2,34],23:[2,34],24:[2,34],25:[2,34],26:[2,34],27:[2,34],28:[2,34],29:[2,34],30:[2,34],31:[2,34],32:[2,34],33:[2,34],34:[2,34],35:[2,34],36:[2,34],37:[2,34]},{5:[2,12],17:[2,12],21:[2,12],22:[2,12],23:[2,12],24:[2,12],25:[2,12],26:[2,12],27:[2,12],28:[2,12],29:[2,12],30:[2,12],31:[2,12],32:[2,12],33:[2,12],34:[2,12],35:[2,12],36:[2,12],37:[2,12]},{5:[2,13],10:26,14:27,17:[2,13],21:[2,13],22:[2,13],23:[2,13],24:[1,17],25:[1,18],26:[1,20],27:[2,13],28:[1,19],29:[2,13],30:[2,13],31:[2,13],32:[2,13],33:[2,13],34:[2,13],35:[1,28],36:[1,29],37:[2,13]},{5:[2,23],17:[2,23],21:[2,23],22:[2,23],23:[2,23],24:[2,23],25:[2,23],26:[2,23],27:[2,23],28:[2,23],29:[2,23],30:[2,23],31:[2,23],32:[2,23],33:[2,23],34:[2,23],35:[2,23],36:[2,23],37:[2,23]},{4:54,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:[1,12],17:[1,13],18:[1,14],19:[1,15],20:[1,16],24:[1,17],25:[1,18],26:[1,20],28:[1,19]},{4:55,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:[1,12],17:[1,13],18:[1,14],19:[1,15],20:[1,16],24:[1,17],25:[1,18],26:[1,20],28:[1,19]},{10:26,14:27,17:[1,23],21:[1,22],22:[1,24],23:[1,25],24:[1,17],25:[1,18],26:[1,20],27:[1,56],28:[1,19],29:[1,30],30:[1,31],31:[1,32],32:[1,33],33:[1,34],34:[1,35],35:[1,28],36:[1,29],37:[1,36]},{5:[2,17],10:26,14:27,17:[2,17],21:[2,17],22:[1,24],23:[1,25],24:[1,17],25:[1,18],26:[1,20],27:[2,17],28:[1,19],29:[1,30],30:[1,31],31:[1,32],32:[1,33],33:[1,34],34:[1,35],35:[1,28],36:[1,29],37:[1,36]},{5:[2,18],10:26,14:27,17:[2,18],21:[2,18],22:[1,24],23:[1,25],24:[1,17],25:[1,18],26:[1,20],27:[2,18],28:[1,19],29:[1,30],30:[1,31],31:[1,32],32:[1,33],33:[1,34],34:[1,35],35:[1,28],36:[1,29],37:[1,36]},{5:[2,19],10:26,14:27,17:[2,19],21:[2,19],22:[2,19],23:[2,19],24:[1,17],25:[1,18],26:[1,20],27:[2,19],28:[1,19],29:[1,30],30:[1,31],31:[1,32],32:[1,33],33:[1,34],34:[1,35],35:[1,28],36:[1,29],37:[1,36]},{5:[2,20],10:26,14:27,17:[2,20],21:[2,20],22:[2,20],23:[2,20],24:[1,17],25:[1,18],26:[1,20],27:[2,20],28:[1,19],29:[1,30],30:[1,31],31:[1,32],32:[1,33],33:[1,34],34:[1,35],35:[1,28],36:[1,29],37:[1,36]},{4:57,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:[1,12],17:[1,13],18:[1,14],19:[1,15],20:[1,16],24:[1,17],25:[1,18],26:[1,20],28:[1,19]},{5:[2,26],10:26,14:27,17:[2,26],21:[2,26],22:[2,26],23:[2,26],24:[1,17],25:[1,18],26:[1,20],27:[2,26],28:[1,19],29:[1,30],30:[1,31],31:[1,32],32:[1,33],33:[1,34],34:[1,35],35:[1,28],36:[1,29],37:[1,36]},{5:[2,27],10:26,14:27,17:[2,27],21:[2,27],22:[2,27],23:[2,27],24:[1,17],25:[1,18],26:[1,20],27:[2,27],28:[1,19],29:[1,30],30:[1,31],31:[1,32],32:[1,33],33:[1,34],34:[1,35],35:[1,28],36:[1,29],37:[1,36]},{5:[2,28],10:26,14:27,17:[2,28],21:[2,28],22:[2,28],23:[2,28],24:[1,17],25:[1,18],26:[1,20],27:[2,28],28:[1,19],29:[1,30],30:[1,31],31:[1,32],32:[1,33],33:[1,34],34:[1,35],35:[1,28],36:[1,29],37:[1,36]},{5:[2,29],10:26,14:27,17:[2,29],21:[2,29],22:[2,29],23:[2,29],24:[1,17],25:[1,18],26:[1,20],27:[2,29],28:[1,19],29:[1,30],30:[1,31],31:[1,32],32:[1,33],33:[1,34],34:[1,35],35:[1,28],36:[1,29],37:[1,36]},{5:[2,30],10:26,14:27,17:[2,30],21:[2,30],22:[2,30],23:[2,30],24:[1,17],25:[1,18],26:[1,20],27:[2,30],28:[1,19],29:[1,30],30:[1,31],31:[1,32],32:[1,33],33:[1,34],34:[1,35],35:[1,28],36:[1,29],37:[1,36]},{5:[2,31],10:26,14:27,17:[2,31],21:[2,31],22:[2,31],23:[2,31],24:[1,17],25:[1,18],26:[1,20],27:[2,31],28:[1,19],29:[1,30],30:[1,31],31:[1,32],32:[1,33],33:[1,34],34:[1,35],35:[1,28],36:[1,29],37:[1,36]},{10:26,14:27,17:[1,23],21:[1,22],22:[1,24],23:[1,25],24:[1,17],25:[1,18],26:[1,20],27:[1,58],28:[1,19],29:[1,30],30:[1,31],31:[1,32],32:[1,33],33:[1,34],34:[1,35],35:[1,28],36:[1,29],37:[1,36]},{10:26,14:27,17:[1,23],21:[1,22],22:[1,24],23:[1,25],24:[1,17],25:[1,18],26:[1,20],27:[1,59],28:[1,19],29:[1,30],30:[1,31],31:[1,32],32:[1,33],33:[1,34],34:[1,35],35:[1,28],36:[1,29],37:[1,36]},{5:[2,35],17:[2,35],21:[2,35],22:[2,35],23:[2,35],24:[2,35],25:[2,35],26:[2,35],27:[2,35],28:[2,35],29:[2,35],30:[2,35],31:[2,35],32:[2,35],33:[2,35],34:[2,35],35:[2,35],36:[2,35],37:[2,35]},{10:26,14:27,17:[1,23],21:[1,22],22:[1,24],23:[1,25],24:[1,17],25:[1,18],26:[1,20],27:[1,60],28:[1,19],29:[1,30],30:[1,31],31:[1,32],32:[1,33],33:[1,34],34:[1,35],35:[1,28],36:[1,29],37:[1,36]},{5:[2,24],17:[2,24],21:[2,24],22:[2,24],23:[2,24],24:[2,24],25:[2,24],26:[2,24],27:[2,24],28:[2,24],29:[2,24],30:[2,24],31:[2,24],32:[2,24],33:[2,24],34:[2,24],35:[2,24],36:[2,24],37:[2,24]},{5:[2,25],17:[2,25],21:[2,25],22:[2,25],23:[2,25],24:[2,25],25:[2,25],26:[2,25],27:[2,25],28:[2,25],29:[2,25],30:[2,25],31:[2,25],32:[2,25],33:[2,25],34:[2,25],35:[2,25],36:[2,25],37:[2,25]},{5:[2,32],17:[2,32],21:[2,32],22:[2,32],23:[2,32],24:[2,32],25:[2,32],26:[2,32],27:[2,32],28:[2,32],29:[2,32],30:[2,32],31:[2,32],32:[2,32],33:[2,32],34:[2,32],35:[2,32],36:[2,32],37:[2,32]}],
defaultActions: {21:[2,1]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        throw new Error(str);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == 'undefined') {
        this.lexer.yylloc = {};
    }
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === 'function') {
        this.parseError = this.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || EOF;
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + this.lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: this.lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: this.lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
undefined/* generated by jison-lex 0.2.0 */
var lexer = (function(){
var lexer = {

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input) {
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            if (this.options.backtrack_lexer) {
                delete backup;
            }
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        if (this.options.backtrack_lexer) {
            delete backup;
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0://skip
break;
case 1:return 15
break;
case 2:return 18
break;
case 3:return 18
break;
case 4:return 18
break;
case 5:return 18
break;
case 6:return 18
break;
case 7:return 18
break;
case 8:return 18
break;
case 9:return 18
break;
case 10:return 18
break;
case 11:return 18
break;
case 12:return 18
break;
case 13:return 18
break;
case 14:return 18
break;
case 15:return 18
break;
case 16:return 18
break;
case 17:return 18
break;
case 18:return 18
break;
case 19:return 18
break;
case 20:return 18
break;
case 21:return 18
break;
case 22:return 18
break;
case 23:return 18
break;
case 24:return 18
break;
case 25:return 18
break;
case 26:return 18
break;
case 27:return 18
break;
case 28:return 18
break;
case 29:return 18
break;
case 30:return 18
break;
case 31:return 18
break;
case 32:return 18
break;
case 33:return 18
break;
case 34:return 18
break;
case 35:return 32
break;
case 36:return 34
break;
case 37:return 30
break;
case 38:return 31
break;
case 39:return 33
break;
case 40:return 29
break;
case 41:return 30
break;
case 42:return 30
break;
case 43:return 25
break;
case 44:return 25
break;
case 45:return 28
break;
case 46:return 24
break;
case 47:return 24
break;
case 48:return 24
break;
case 49:return 24
break;
case 50:return 24
break;
case 51:return 24
break;
case 52:return 24
break;
case 53:return 24
break;
case 54:return 20 /*Tous les mots clés doivent être placés avant cette ligne*/
break;
case 55:return 19
break;
case 56:return 22
break;
case 57:return 23
break;
case 58:return 17
break;
case 59:return 21
break;
case 60:return 35
break;
case 61:return 36
break;
case 62:return 37
break;
case 63:return 16
break;
case 64:return 26
break;
case 65:return 27
break;
case 66:return 5
break;
case 67:return 'INVALID'
break;
}
},
rules: [/^(?:\s+)/,/^(?:\d+([.]\d+)?\b)/,/^(?:alpha\b)/,/^(?:beta\b)/,/^(?:gamma\b)/,/^(?:delta\b)/,/^(?:epsilon\b)/,/^(?:zeta\b)/,/^(?:eta\b)/,/^(?:Delta\b)/,/^(?:Theta\b)/,/^(?:theta\b)/,/^(?:iota\b)/,/^(?:kappa\b)/,/^(?:lambda\b)/,/^(?:mu\b)/,/^(?:nu\b)/,/^(?:xi\b)/,/^(?:Lambda\b)/,/^(?:Xi\b)/,/^(?:Pi\b)/,/^(?:pi\b)/,/^(?:rho\b)/,/^(?:sigma\b)/,/^(?:tau\b)/,/^(?:Sigma\b)/,/^(?:Upsilon\b)/,/^(?:Phi\b)/,/^(?:upsilon\b)/,/^(?:phi\b)/,/^(?:chi\b)/,/^(?:psi\b)/,/^(?:omega\b)/,/^(?:Psi\b)/,/^(?:Omega\b)/,/^(?:>=)/,/^(?:<=)/,/^(?:!=)/,/^(?:>)/,/^(?:<)/,/^(?:=)/,/^(?:n'égal pas\b)/,/^(?:not equal\b)/,/^(?:sqrt\b)/,/^(?:racine de\b)/,/^(?:abs\b)/,/^(?:log\b)/,/^(?:ln\b)/,/^(?:sin\b)/,/^(?:cos\b)/,/^(?:tan\b)/,/^(?:arcsin\b)/,/^(?:arccos\b)/,/^(?:arctan\b)/,/^(?:[a-zA-Z]+[0-9]{1,2})/,/^(?:[a-zA-Z]+)/,/^(?:\*)/,/^(?:\/)/,/^(?:-)/,/^(?:\+)/,/^(?:\^)/,/^(?:[⁰|¹|²|³|⁴|⁵|⁶|⁷|⁸|⁹]+)/,/^(?:!)/,/^(?:%)/,/^(?:\()/,/^(?:\))/,/^(?:$)/,/^(?:.)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67],"inclusive":true}}
};
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = EquationToLaTex;
exports.Parser = EquationToLaTex.Parser;
exports.parse = function () { return EquationToLaTex.parse.apply(EquationToLaTex, arguments); };
exports.main = function commonjsMain(args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}