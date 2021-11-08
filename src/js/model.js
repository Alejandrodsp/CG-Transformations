class Model {
  constructor() {
    this.gl = gl;
    this.meshProgramInfo = meshProgramInfo;
    this.bufferInfo = shapes.getRandomShapeBuffer();
    this.setVao(this.gl, this.meshProgramInfo);
    this.setUniforms();

    this.translation = {
      x: 0,
      y: 0,
      z: 0,
      c: 0,
    };

    this.rotation = {
      x: degToRad(0),
      y: degToRad(0),
      z: degToRad(0),
      r: degToRad(0),
      xPoint: degToRad(0),
      yPoint: degToRad(0),
      zPoint: degToRad(0),
    };

    this.scale = {
      x: 1,
      y: 1,
      z: 1,
      factor: 1,
    };
    
    this.target = -1
  }

  //function to set a vertex array object and your attributes
  setVao() {
    this.vao = twgl.createVAOFromBufferInfo(
      this.gl,
      meshProgramInfo,
      this.bufferInfo
    );
  }

  //function to set the collors attributes of model
  setUniforms() {
    const r = Math.random();
    const g = Math.random();
    const b = Math.random();

    this.uniforms = {
      u_colorMult: [r, g, b, 1],
      u_matrix: m4.identity,
    };
  }

  //Function to draw a model
  drawModel(viewProjectionMatrix) {
    this.gl.bindVertexArray(this.vao);
    this.computeMatrix(viewProjectionMatrix);
    twgl.setUniforms(this.meshProgramInfo, this.uniforms);
    twgl.drawBufferInfo(this.gl, this.bufferInfo);
  }

  //Compute model matrix
  computeMatrix(viewProjectionMatrix) {

    //Scale the model keep aspect
    const scaleVectorProportional = [
      this.scale.factor,
      this.scale.factor,
      this.scale.factor,
    ];

    //Scale the model
    const scaleVector = [
      this.scale.x,
      this.scale.y,
      this.scale.z,
    ];

    //Function to do a point rotation
    const pointRotation = (matrix, point, pRotation) => {
      //Translate
      matrix = m4.translate(matrix, point[0], point[1], point[2]);

      //Rotate
      matrix = m4.zRotate(matrix, pRotation);

      //Translate back
      matrix = m4.translate(matrix, -point[0], -point[1], -point[2]);

      return matrix;
    };

    //point vector to use in function pointRotation
    var point = [
      this.rotation.xPoint, this.rotation.yPoint, this.rotation.zPoint,
    ];

    //rotation to use in function pointRotation
    var pRotation = degToRad(this.rotation.r * 3.6);

    //Define a translate curve
    const splineCurve = (matrix, TransC, x, y) => {
      let t = TransC * 0.01;
      let xOut =
        (1 - t) *
        ((1 - t) * ((1 - t) * x[0] + t * x[1]) +
          t * ((1 - t) * x[1] + t * x[2])) +
        t *
        ((1 - t) * ((1 - t) * x[1] + t * x[2]) +
          t * ((1 - t) * x[2] + t * x[3]));
      let yOut =
        (1 - t) *
        ((1 - t) * ((1 - t) * y[0] + t * y[1]) +
          t * ((1 - t) * y[1] + t * y[2])) +
        t *
        ((1 - t) * ((1 - t) * y[1] + t * y[2]) +
          t * ((1 - t) * y[2] + t * y[3]));

      matrix = m4.translate(matrix, xOut, yOut, 0);

      return matrix;
    };

    //Translate the model
    //Linear
    let matrix = m4.translate(
      viewProjectionMatrix,
      this.translation.x,
      this.translation.y,
      this.translation.z
    );
    //Curve
    matrix = splineCurve(
      matrix,
      50 - this.translation.c,
      [75, 0, 0, -75],
      [0, -100, 100, 0]
    );

    //Rotate the model
    //Axis
    matrix = m4.axisRotate(matrix, [1, 0, 0], this.rotation.x);
    matrix = m4.axisRotate(matrix, [0, 1, 0], this.rotation.y);
    matrix = m4.axisRotate(matrix, [0, 0, 1], this.rotation.z);
    //Point
    matrix = pointRotation(matrix, point, pRotation);

    //Scale the model
    matrix = twgl.m4.scale(matrix, scaleVectorProportional);
    matrix = twgl.m4.scale(matrix, scaleVector);
    

    this.uniforms.u_matrix = matrix;
  }
  //Model animation
  animation(fristAnimation, secondAnimation, inverse, secondInverse) {
    var startTime = Date.now();
    var runAnimation= setInterval(() => {
      //Translation case
      if (fristAnimation.type === 'translation') {
        if (fristAnimation.direction === 'positive') {
          if (fristAnimation.axis === 'x') {
            this.translation.x += 1;
          }
          else if (fristAnimation.axis === 'y') {
            this.translation.y += 1;
          }
          else {
            this.translation.z += 1;
          }
        }
        else {
          if (fristAnimation.axis === 'x') {
            this.translation.x -= 1;
          }
          else if (fristAnimation.axis === 'y') {
            this.translation.y -= 1;
          }
          else {
            this.translation.z -= 1;
          }
        }
      }
      //Rotation case
      else {
        if (fristAnimation.direction === 'positive') {
          if (fristAnimation.axis === 'x') {
            this.rotation.x += 0.1;
          }
          else if (fristAnimation.axis === 'y') {
            this.rotation.y += 0.1;
          }
          else {
            this.rotation.z += 0.1;
          }
        }
        else {
          if (fristAnimation.axis === 'x') {
            this.rotation.x -= 0.1;
          }
          else if (fristAnimation.axis === 'y') {
            this.rotation.y -= 0.1;
          }
          else {
            this.rotation.z -= 0.1;
          }
        }
      }
      //check if the runtime is over
      if (Date.now() - startTime > fristAnimation.amount * 1000) {
        clearInterval(runAnimation);
        //first animation is over, is need to run the second animation
        if (secondAnimation && inverse == false && secondInverse == false) {
          if (fristAnimation.direction === 'positive') {
            fristAnimation.direction = 'negative';
          }
          else {
            fristAnimation.direction = 'positive';
          }
          this.animation(secondAnimation, fristAnimation, true, false);
        }
        //second animation is over, is need to run the frist inverse animation
        else if (secondAnimation && inverse == true && secondInverse == false) {
          if (fristAnimation.direction === 'positive') {
            fristAnimation.direction = 'negative';
          }
          else {
            fristAnimation.direction = 'positive';
          }
          this.animation(secondAnimation, fristAnimation, true, true);
        }
        //frist inverse animation is over, is need to run the second inverse animation
        else if (secondAnimation && inverse == true && secondInverse == true) {
          this.animation(secondAnimation, false, true, true);
        }
      }
    }, 25);
  }
}
