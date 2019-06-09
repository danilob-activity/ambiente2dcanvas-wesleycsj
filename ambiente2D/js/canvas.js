const Canvas =
  (function() {
    let canvas = document.getElementById('canvas')
    let context = document.getElementById('canvas').getContext('2d');
    let objects = []
    let objectSelected = null
    // Sets the canvas to entire div.column size
    canvas.width = canvas.parentNode.getBoundingClientRect().width
    canvas.height = canvas.parentNode.getBoundingClientRect().height

    let origin = {
      x: (canvas.width / 2),
      y: (canvas.height / 2),
      setOrigin: function(x, y) {
        this.x = x,
          this.y = y
      }
    }
    /* Functions
     */
    /*
     * Initialize the default look to canvas
     */
    function init() {
      clearCanvas()
      drawBackgroundColor()
      drawOrigin()
    }
    /*
     *  Draws background color
     */
    function drawBackgroundColor() {
      context.fillStyle = '#202225'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.fillStyle = '#FFFFFF'
    }
    /*
     * Draws lines from the origin point
     */
    function drawOrigin() {
      context.beginPath()
      context.strokeStyle = '#9E9E9E'
      context.moveTo(origin.x, 0)
      context.lineTo(origin.x, canvas.height)
      context.moveTo(0, origin.y)
      context.lineTo(canvas.width, origin.y)
      context.closePath()
      context.stroke()
      context.strokeStyle = '#000000'
    }
    /*
     * Clear the canvas
     */
    function clearCanvas() {
      context.clearRect(0, 0, canvas.width, canvas.height)
    }
    /*
     *  Includes a box to the objects list
     */
    function addBox(width, height, center = [0, 0, 1]) {
      let object = {
        name: '',
        type: 'box',
        width: width,
        height: height,
        center: center,
        fill: '#FFFFFF',
        stroke: '#000000',
        actualStroke: '#000000',
        T: Math.identity(),
        R: Math.identity(),
        S: Math.identity(),
        angleRotation: 0
      }
      objectSelected = objects.push(object)
      drawObjects()
      return objectSelected
    }
    /*
     *  Includes a circle to the objects list
     */
    function addCircle(radius, center = [0, 0, 1]) {
      objectSelected = objects.push({
        name: '',
        type: 'circle',
        radius: radius,
        center: center,
        fill: '#FFFFFF',
        stroke: '#000000',
        actualStroke: '#000000',
        T: Math.identity(),
        R: Math.identity(),
        S: Math.identity(),
        angleRotation: 0
      })
      drawObjects()
      return objectSelected
    }
    /*
     * Add a new object to be rendered
     */
    function drawObjects() {
      init()
      for (let o in objects) {
        if (objectSelected === o) {
          objects[o].actualStroke = objects[o].stroke
        }
        if (objects[o].type === 'box') {
          drawBox(objects[o], (objectSelected === o))
        } else if (objects[o].type === 'circle') {
          drawCircle(objects[o], (objectSelected === o))
        }
      }
    }
    /*
     * Draw a Box
     */
    function drawBox(o, isSelected) {
      context.lineWidth = 2
      context.strokeStyle = o.stroke
      context.fillStyle = o.fill

      let canvasMatrix = Math.transformCanvas(canvas.width, canvas.height)
      let transformMatrix = Math.multiply(canvasMatrix, o.T, o.R, o.S)

      let points = []
      points.push([o.center[0] + o.width / 2, o.center[1] + o.height / 2, 1])
      points.push([o.center[0] - o.width / 2, o.center[1] + o.height / 2, 1])
      points.push([o.center[0] - o.width / 2, o.center[1] - o.height / 2, 1])
      points.push([o.center[0] + o.width / 2, o.center[1] - o.height / 2, 1])

      context.beginPath()

      let pointsTransformed = []
      for (let i = 0; i < points.length; i++) {
        pointsTransformed[i] = Math.multVec(transformMatrix, points[i])
        if (i === 0) {
          context.moveTo(pointsTransformed[i][0], pointsTransformed[i][1])
        } else {
          context.lineTo(pointsTransformed[i][0], pointsTransformed[i][1])
        }
      }
      context.closePath()
      context.fill()
      context.strokeStyle = o.actualStroke
      context.stroke()

      if (isSelected) {
        context.beginPath()
        circlePoints = Math.multVec(transformMatrix, points[1])
        context.arc(circlePoints[0], circlePoints[1], 5, 0, 2 * Math.PI);
        context.fillStyle = '#FF0000'
        context.fill()
        context.strokeStyle = '#0000FF'
        context.stroke()
      }

      context.fillStyle = o.actualStroke
      context.font = "15px Arial";
      let textPosition = Math.multVec(Math.multiply(canvasMatrix, o.T, Math.identity(), o.S), [o.center[0] - o.width / 2, o.center[1] - o.height, 1])
      context.fillText(o.name, textPosition[0], textPosition[1]);
    }
    /*
     *  Draw a circle
     */
    function drawCircle(o, isSelected) {
      context.lineWidth = 2
      context.strokeStyle = o.stroke
      context.fillStyle = o.fill

      let canvasMatrix = Math.transformCanvas(canvas.width, canvas.height)
      let transformMatrix = Math.multiply(canvasMatrix, o.T, o.R, o.S)

      let points = []
      let alpha = 2 * Math.PI / 30
      for (i = 0; i < 30; i++) {
        points.push([Math.cos(alpha * i) * o.radius + o.center[0], Math.sin(alpha * i) * o.radius + o.center[1], 1]);
      }
      context.beginPath();
      for (let i = 0; i < points.length; i++) {
        points[i] = Math.multVec(transformMatrix, points[i]); //transformando o ponto em coordenadas canonicas em coordenadas do canvas
        if (i == 0) {
          context.moveTo(points[i][0], points[i][1])
        } else {
          context.lineTo(points[i][0], points[i][1])
        }
      }
      context.lineTo(points[0][0], points[0][1])
      context.fill()
      context.strokeStyle = o.actualStroke
      context.stroke()
      if (isSelected) {
        context.beginPath()
        circlePoints = Math.multVec(transformMatrix, [Math.cos(alpha * 7) * o.radius + o.center[0], Math.sin(alpha * 7) * o.radius + o.center[1], 1])
        context.arc(circlePoints[0], circlePoints[1], 5, 0, 2 * Math.PI);
        context.fillStyle = '#FF0000'
        context.fill()
        context.strokeStyle = '#0000FF'
        context.stroke()
      }
      context.fillStyle = o.actualStroke
      context.font = "15px Arial";
      let textPosition = Math.multVec(Math.multiply(canvasMatrix, o.T, Math.identity(), o.S), [o.center[0] - o.radius, o.center[1] - 2 * o.radius, 1])
      context.fillText(o.name, textPosition[0], textPosition[1]);
    }
    /*
     *  Calculates BoundingBox intersection
     */
    function CheckCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
      return (x1 < x2 + w2) && (x2 < x1 + w1) && (y1 < y2 + h2) && (y2 < y1 + h1)
    }
    /*
     *  Calculate intersection from mouse with a box or circle and executes a callback or fallback
     */
    function intersects(mX, mY, callback, fallback) {
      let transformedMouse = Math.multVec(Math.transformUsual(canvas.width, canvas.height), [mX, mY, 1])
      let collides = false
      for (let o in objects) {
        let inverseTranslate = Math.inverseTranslate(objects[o].T[0][2], objects[o].T[1][2])
        let inverseRotate = Math.inverseRotate(parseInt(objects[o].angleRotation))
        let inverseScale = Math.inverseScale(objects[o].S[0][0], objects[o].S[1][1])
        let inverseTRS = Math.multiply(inverseScale, inverseRotate, inverseTranslate)
        let mousePositionTransformed = Math.multVec(inverseTRS, transformedMouse)

        if (objects[o].type === 'box') {
          let leftmostPoint = [objects[o].center[0] - objects[o].width / 2, objects[o].center[1] - objects[o].height / 2, 1]
          collides = CheckCollision(mousePositionTransformed[0], mousePositionTransformed[1], 1, 1,
            leftmostPoint[0], leftmostPoint[1], objects[o].width, objects[o].height)
        } else if (objects[o].type === 'circle') {
          collides = ((mousePositionTransformed[0] * mousePositionTransformed[0]) + (mousePositionTransformed[1] * mousePositionTransformed[1]) <= (objects[o].radius * objects[o].radius))
        }
        if (collides) {
          callback(o)
        } else if (fallback) {
          fallback(o)
        }
      }
      init()
      drawObjects()
    }
    /*
     * Put object selected properties in the inputs
     */
    function setPropertiesToInput() {
      let name = document.getElementById('name')
      let width = document.getElementById('width')
      let height = document.getElementById('height')
      let stroke = document.getElementById('stroke')
      let fill = document.getElementById('fill')
      let transform = document.getElementById('transform')
      let rotate = document.getElementById('rotate')
      let scale = document.getElementById('scale')

      if (objectSelected > -1) {
        if (objects[objectSelected].type === 'box') {
          name.value = objects[objectSelected].name
          width.value = objects[objectSelected].width
          height.value = objects[objectSelected].height
          stroke.value = objects[objectSelected].stroke
          fill.value = objects[objectSelected].fill
          transform.value = objects[objectSelected].T[0][2] + ',' + objects[objectSelected].T[1][2]
          rotate.value = objects[objectSelected].angleRotation
          scale.value = objects[objectSelected].S[0][0] + ',' + objects[objectSelected].S[1][1]
        } else if (objects[objectSelected].type === 'circle') {
          name.value = objects[objectSelected].name
          stroke.value = objects[objectSelected].stroke
          fill.value = objects[objectSelected].fill
          transform.value = objects[objectSelected].T[0][2] + ',' + objects[objectSelected].T[1][2]
          rotate.value = objects[objectSelected].angleRotation
          scale.value = objects[objectSelected].S[0][0] + ',' + objects[objectSelected].S[1][1]
        }
      }
    }
    /*
     * Put object selected properties in the inputs
     */
    function setPropertiesToObject() {
      let name = document.getElementById('name')
      let width = document.getElementById('width')
      let height = document.getElementById('height')
      let stroke = document.getElementById('stroke')
      let fill = document.getElementById('fill')
      let transform = document.getElementById('transform')
      let rotate = document.getElementById('rotate')
      let scale = document.getElementById('scale')

      if (objectSelected > -1) {
        if (objects[objectSelected].type === 'box') {
          objects[objectSelected].name = name.value
          objects[objectSelected].width = parseInt(width.value)
          objects[objectSelected].height = parseInt(height.value)
          objects[objectSelected].stroke = stroke.value
          objects[objectSelected].fill = fill.value
          objects[objectSelected].angleRotation = parseInt(rotate.value)
          Math.setTranslate(objects[objectSelected], parseFloat(transform.value.split(',')[0]), parseFloat(transform.value.split(',')[1]))
          Math.setRotate(objects[objectSelected], rotate.value)
          Math.setScale(objects[objectSelected], parseFloat(scale.value.split(',')[0]), parseFloat(scale.value.split(',')[1]))
        } else if (objects[objectSelected].type === 'circle') {
          objects[objectSelected].name = name.value
          objects[objectSelected].stroke = stroke.value
          objects[objectSelected].fill = fill.value
          objects[objectSelected].angleRotation = parseInt(rotate.value)
          Math.setTranslate(objects[objectSelected], parseFloat(transform.value.split(',')[0]), parseFloat(transform.value.split(',')[1]))
          Math.setRotate(objects[objectSelected], rotate.value)
          Math.setScale(objects[objectSelected], parseFloat(scale.value.split(',')[0]), parseFloat(scale.value.split(',')[1]))
        }
      }
      init()
      drawObjects()
    }
    /*
     * Callbacks
     */
    let isMoving = 0
    canvas.addEventListener('mousemove', function(e) {
      if (isMoving > 0) {
        let transformedMouse = Math.multVec(Math.transformUsual(canvas.width, canvas.height), [e.clientX, e.clientY, 1])
        Math.setTranslate(objects[objectSelected], transformedMouse[0], transformedMouse[1])
        setPropertiesToInput()
      }
      intersects(e.offsetX, e.offsetY, function(o) {
        objects[o].actualStroke = '#FF0000'
      }, function(o) {
        objects[o].actualStroke = objects[o].stroke
      })
    })
    canvas.addEventListener('dblclick', function(e) {
      intersects(e.offsetX, e.offsetY, function(o) {
        objectSelected = o
        isMoving = 1
        setPropertiesToInput()
      })
      init()
      drawObjects()
    })
    canvas.addEventListener('click', function(e) {
      intersects(e.offsetX, e.offsetY, function(o) {
        if (isMoving === 1) {
          isMoving = 0
        } else {
          objectSelected = o
          setPropertiesToInput()
        }
      }, function(o) {
        if (objectSelected === o) {
          objectSelected = -1
        }
      })
      init()
      drawObjects()
    })
    /* Functions to be called at opening
     */
    init()
    return {
      init: init,
      //to be removed
      objects: objects,
      objectSelected: objectSelected,
      drawObjects: drawObjects,
      addBox: addBox,
      addCircle: addCircle,
      setPropertiesToObject: setPropertiesToObject
    }
  })();
