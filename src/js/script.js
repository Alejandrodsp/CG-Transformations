const { gl, meshProgramInfo } = initializeWorld();
// shapes object
const shapes = new Shape();
// models array
const models = [];
// cameras array with default camera
const cameras = [new Camera('Center Camera', 0, 0, 100, 0, 0, 0, 0, 0)];
// index of cameras array
var activeCamera = 0;
// active camera
var camera = cameras[activeCamera];
// create 2nd and 3rd cameras.
cameras.push(new Camera('Right Camera', 100, 0, 25, 0, 0, 0, 0, 0));
cameras.push(new Camera('Left Camera', -100, 0, 25, 0, 0, 0, 0, 0));

function main() {

  loadGUI();

  function render() {
    twgl.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    var projectionMatrix = camera.computeProjectionMatrix();
    var viewMatrix = m4.inverse(camera.computeCameraMatrix());

    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    gl.useProgram(meshProgramInfo.program);

    models.forEach((model) => {
      if (model) {
        model.drawModel(viewProjectionMatrix);
      }
    });
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
