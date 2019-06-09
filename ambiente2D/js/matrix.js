/*
 *  Attach to Math global these properties to matrix calcs
 */
(function() {
  /*
   * Receives a normal width and height and returns a canvas transformed
   */
  Math.transformCanvas = function(width, height) {
    return [
      [1, 0, (width / 2)],
      [0, -1, (height / 2)],
      [0, 0, 1]
    ]
  }
  /*
   * Receives a normal width and height and returns a canvas transformed to usual
   */
  Math.transformUsual = function(width, height) {
    return [
      [1, 0, (-width / 2)],
      [0, -1, (height / 2)],
      [0, 0, 1]
    ]
  }
  /*
   * Returns identity matrix
   */
  Math.identity = function(i = 1) {
    return [
      [i, 0, 0],
      [0, i, 0],
      [0, 0, i]
    ]
  }
  /*
   * Return a matrix scaled
   */
  Math.translate = function(x, y) {
    return [
      [1, 0, x],
      [0, 1, y],
      [0, 0, 1]
    ]
  }
  /*
   * Return a translate matrix inversed
   */
  Math.inverseTranslate = function(x, y) {
    return [
      [1, 0, -x],
      [0, 1, -y],
      [0, 0, 1]
    ]
  }
  /*
   *  Return a rotate matrix
   */
  Math.rotate = function(theta) {
    theta = ((theta * Math.PI) / 180)
    return [
      [Math.cos(theta), -Math.sin(theta), 0],
      [Math.sin(theta), Math.cos(theta), 0],
      [0, 0, 1]
    ]
  }
  /*
   * Return a inversed rotate matrix
   */
   Math.inverseRotate = function(theta) {
     theta = ((theta * Math.PI) / 180)
     return [
       [Math.cos(theta), Math.sin(theta), 0],
       [-Math.sin(theta), Math.cos(theta), 0],
       [0, 0, 1]
     ]
   }
  /*
   * Return a matrix scaled
   */
  Math.scale = function(sx, sy) {
    return [
      [sx, 0, 0],
      [0, sy, 0],
      [0, 0, 1]
    ]
  }
  /*
   * Return a matrix scaled
   */
  Math.inverseScale = function(sx, sy) {
    return [
      [(1/sx), 0, 0],
      [0, (1/sy), 0],
      [0, 0, 1]
    ]
  }
  /*
   *  Apply functions
   */
   Math.setTranslate = (o, x, y) => {
     o.T = Math.translate(x, y)
   }
   Math.setRotate = (o, theta) => {
     o.R = Math.rotate(theta)
   }
   Math.setScale = (o, sx,sy) => {
     o.S = Math.scale(sx, sy)
   }
  /*
   * Multiply any given matrix
   */
  Math.multiply = function(m) {
    let length = arguments.length
    let result = []
    let matrices = []
    for (let n in arguments) {
      matrices.push(arguments[n])
    }
    if (matrices.length > 1) {
      while (matrices.length > 1) {
        for (let iteration in matrices[0]) {
          let elements = []
          for (let line in matrices[0]) {
            let element = 0
            for (let column in matrices[1]) {
              element = element + (matrices[0][iteration][column] * matrices[1][column][line])
            }
            elements.push(element)
          }
          result.push(elements)
        }
        //Just shift the first matrix used to calc, and the second will be at index 0, after, replaces
        // this second matrix by the result from its multiply
        matrices.shift()
        matrices[0] = result
        result = []
      }
      return matrices[0]
    } else {
      console.error('Less than two matrices given to multiply()')
    }
  }
  /*
   *
   */
  Math.multVec = function (A, b) { //multiplicação de uma matriz (3x3) e um vetor
    var C = [0, 0, 0];
    var i;
    var j;
    for (i = 0; i < 3; i++) {
      C[i] = A[i][0] * b[0] + A[i][1] * b[1] + A[i][2] * b[2];
    }
    return C; //retorna um vetor
  }
})()
