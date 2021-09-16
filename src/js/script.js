function main() {
  const { gl, meshProgramInfo } = initializeWorld();
  loadGUI();
  const shapeTranslation = [0, 0, 0];

  const cubeBufferInfo = flattenedPrimitives.createCubeBufferInfo(gl, 20);
  const sphereBufferInfo = flattenedPrimitives.createSphereBufferInfo(gl, 10, 12, 6);
  const coneBufferInfo = flattenedPrimitives.createTruncatedConeBufferInfo(gl, 10, 0, 20, 12, 1);
  const cylinderBufferInfo = flattenedPrimitives.createCylinderBufferInfo(gl, 10, 12, 12, 6);

   shapesArray = [cubeBufferInfo, sphereBufferInfo, coneBufferInfo, cylinderBufferInfo];
   randomIndex = Math.floor(Math.random() * shapesArray.length);

  const shapeVAO = twgl.createVAOFromBufferInfo(
    gl,
    meshProgramInfo,
    shapesArray[randomIndex],
  );

  var fieldOfViewRadians = degToRad(60);

  const shapeUniforms = {
    u_colorMult: [Math.random(), Math.random(), Math.random(), 1],
    u_matrix: m4.identity(),
  };

  function computeMatrix(viewProjectionMatrix, translation, yRotation) {
    var matrix = m4.translate(
      viewProjectionMatrix,
      translation[0],
      translation[1],
      translation[2],
    );
    return m4.yRotate(matrix, yRotation);
  }

  
  
  function render() {
    twgl.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

    // Compute the camera's matrix using look at.
    var cameraPosition = [0, 0, 100];
    var target = [0, 0, 0];
    var up = [0, 1, 0];
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);

    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    gl.useProgram(meshProgramInfo.program);

    // ------ Draw the cube --------

    // Setup all the needed attributes.
    gl.bindVertexArray(shapeVAO);
    shapeTranslation[0] = config.translateX;
    shapeTranslation[1] = config.translateY;
    shapeTranslation[2] = config.translateZ;

    shapeUniforms.u_matrix = computeMatrix(
      viewProjectionMatrix,
      shapeTranslation,
      config.rotate,
    );

    // Set the uniforms we just computed
    twgl.setUniforms(meshProgramInfo, shapeUniforms);

    twgl.drawBufferInfo(gl, shapesArray[randomIndex]);
	requestAnimationFrame(render);
  }
     
  requestAnimationFrame(render);
}

main();
