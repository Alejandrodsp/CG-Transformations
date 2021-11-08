class Camera {
  constructor(name, positionX, positionY, positionZ, positionCurve, rotationXP, rotationYP, rotationZP, rotationAP) {
    this.name = name;
    this.fieldOfViewRadians = degToRad(60);
    this.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    this.zNear = 1;
    this.zFar = 1000;

    this.position = {
      x: positionX,
      y: positionY,
      z: positionZ,
    };

    this.rotation = {
      x: degToRad(0),
      y: degToRad(0),
      z: degToRad(0),
    };

    this.zoom = {
      factor: 1,
    };

    this.curve = {
      c: positionCurve,
    }
    
    this.rotationP = {
      xp: rotationXP,
      yp: rotationYP,
      zp: rotationZP,
      ap: rotationAP,
    };
  }

  computeCameraMatrix() {
    //Camera position
    this.cameraPosition = [this.position.x, this.position.y, this.position.z];

    //Camera target
    //traverses the array of models if one has its look at marked the camera target receives its coordinates
    if (this.target) {
      models.forEach((model) => {
        if (model.target == 1) {
          this.target = [model.translation.x, model.translation.y, model.translation.z];
        }
      });
    } else {
      this.target = [0, 0, 0];
    }

    //Up vector
    this.up = [0, 1, 0];
    let cameraMatrix = m4.lookAt(this.cameraPosition, this.target, this.up);

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
      this.rotationP.xp, this.rotationP.yp, this.rotationP.zp,
    ];

    //rotation to use in function pointRotation
    var pRotation = degToRad(this.rotationP.ap * 3.6);

    //Compute pointRotation
    cameraMatrix = pointRotation(cameraMatrix, point, pRotation);

    //Define a translate curve
    const splineCurve = (matrix, TransC, x, y) => {
      let t = TransC * 0.01;

      let xOut =
        (1 - t) * ((1 - t) * ((1 - t) * x[0] + t * x[1]) +
          t * ((1 - t) * x[1] + t * x[2])) +
        t * ((1 - t) * ((1 - t) * x[1] + t * x[2]) +
          t * ((1 - t) * x[2] + t * x[3]));

      let yOut =
        (1 - t) * ((1 - t) * ((1 - t) * y[0] + t * y[1]) +
          t * ((1 - t) * y[1] + t * y[2])) +
        t * ((1 - t) * ((1 - t) * y[1] + t * y[2]) +
          t * ((1 - t) * y[2] + t * y[3]));

      matrix = m4.translate(matrix, xOut, yOut, 0);

      return matrix;
    };

    //Compute translate curve
    cameraMatrix = splineCurve(
      cameraMatrix,
      50 - this.curve.c,
      [75, 0, 0, -75],
      [0, -100, 100, 0]
    );

    //Compute x, y and z rotation
    cameraMatrix = m4.axisRotate(cameraMatrix, [1, 0, 0], degToRad(this.rotation.x * 3.6));
    cameraMatrix = m4.axisRotate(cameraMatrix, [0, 1, 0], degToRad(this.rotation.y * 3.6));
    cameraMatrix = m4.axisRotate(cameraMatrix, [0, 0, 1], degToRad(this.rotation.z * 3.6));

    return cameraMatrix;
  }

  //updates the camera target
  updateTarget(x, y, z) {
    this.target = [x, y, z];
    camera.computeCameraMatrix();
  }

  //In camera animation i defined the camera animation as follows, the user chooses two types of animations that will run one after the other,
  //after this execution the function will run animations in the opposite direction of the first ones to return the camera to the starting point.
  camAnimation(fristAnimation, secondAnimation, inverse, secondInverse) {
    let cameraMatrix = m4.lookAt(this.cameraPosition, this.target, this.up);
    var startTime = Date.now();
    var runTransformation = setInterval(() => {
      //Translation case
      if (fristAnimation.type === 'translation') {
        if (fristAnimation.direction === 'positive') {
          if (fristAnimation.axis === 'x') {
            this.position.x += 1;
            cameraMatrix = m4.translate(cameraMatrix, this.position.x, this.position.y, this.position.z);
          }
          else if (fristAnimation.axis === 'y') {
            this.position.y += 1;
            cameraMatrix = m4.translate(cameraMatrix, this.position.x, this.position.y, this.position.z);
          }
          else {
            this.position.z += 1;
            cameraMatrix = m4.translate(cameraMatrix, this.position.x, this.position.y, this.position.z);
          }
        }
        else {
          if (fristAnimation.axis === 'x') {
            this.position.x -= 1;
            cameraMatrix = m4.translate(cameraMatrix, this.position.x, this.position.y, this.position.z);
          }
          else if (fristAnimation.axis === 'y') {
            this.position.y -= 1;
            cameraMatrix = m4.translate(cameraMatrix, this.position.x, this.position.y, this.position.z);
          }
          else {
            this.position.z -= 1;
            cameraMatrix = m4.translate(cameraMatrix, this.position.x, this.position.y, this.position.z);
          }
        }
      }
      //Rotation case
      else {
        if (fristAnimation.direction === 'positive') {
          if (fristAnimation.axis === 'x') {
            this.rotation.x += 0.1;
            cameraMatrix = m4.axisRotate(cameraMatrix, [1, 0, 0], degToRad(this.rotation.x * 3.6));
          }
          else if (fristAnimation.axis === 'y') {
            this.rotation.y += 0.1;
            cameraMatrix = m4.axisRotate(cameraMatrix, [0, 1, 0], degToRad(this.rotation.y * 3.6));
          }
          else {
            this.rotation.z += 0.1;
            cameraMatrix = m4.axisRotate(cameraMatrix, [0, 0, 1], degToRad(this.rotation.z * 3.6));
          }
        }
        else {
          if (fristAnimation.axis === 'x') {
            this.rotation.x -= 0.1;
            cameraMatrix = m4.axisRotate(cameraMatrix, [1, 0, 0], degToRad(this.rotation.x * 3.6));
          }
          else if (fristAnimation.axis === 'y') {
            this.rotation.y -= 0.1;
            cameraMatrix = m4.axisRotate(cameraMatrix, [0, 1, 0], degToRad(this.rotation.y * 3.6));
          }
          else {
            this.rotation.z -= 0.1;
            cameraMatrix = m4.axisRotate(cameraMatrix, [0, 0, 1], degToRad(this.rotation.z * 3.6));
          }
        }
      }
      //check if the runtime is over
      if (Date.now() - startTime > fristAnimation.amount * 1000) {
        clearInterval(runTransformation);
        //first animation is over, is need to run the second animation
        if (secondAnimation && inverse == false && secondInverse == false) {
          if (fristAnimation.direction === 'positive') {
            fristAnimation.direction = 'negative';
          }
          else {
            fristAnimation.direction = 'positive';
          }
          this.camAnimation(secondAnimation, fristAnimation, true, false);
        }
        //second animation is over, is need to run the frist inverse animation
        else if (secondAnimation && inverse == true && secondInverse == false) {
          if (fristAnimation.direction === 'positive') {
            fristAnimation.direction = 'negative';
          }
          else {
            fristAnimation.direction = 'positive';
          }
          this.camAnimation(secondAnimation, fristAnimation, true, true);
        }
        //frist inverse animation is over, is need to run the second inverse animation
        else if (secondAnimation && inverse == true && secondInverse == true) {
          this.camAnimation(secondAnimation, false, true, true);
        }
      }
    }, 25);
  }

  computeProjectionMatrix() {
      this.projectionMatrix = m4.perspective(
      this.fieldOfViewRadians,
      this.aspect,
      this.zNear,
      this.zFar
    );
    return this.projectionMatrix;
  }

  setFieldOfViews(value) {
    this.fieldOfViewRadians = degToRad(value);
  }
}
