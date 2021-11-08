//convert from degrees to radians 
const degToRad = (d) => (d * Math.PI) / 180;

//convert from radians to degrees
const radToDeg = (r) => (r * 180) / Math.PI;

//function to add a new model in the world
function addMod() {
  models.push(new Model());
  animation.selectModel = getAvailableModels();
}

//function to remove a model in the world
function removeMod(modelIndex) {
  models.splice(modelIndex, 1, false);
  animation.selectModel = getAvailableModels();
}

//function to return an array with the indices of the current models in the world
function getAvailableModels() {
  const availableModels = new Array();
  models.forEach((model, index) => {
    if (model) {
      const modelNumber = index + 1;
      availableModels.push(modelNumber);
    }
  });
  return availableModels;
}

//function to update the active camera 
function changeCamera(cameraName) {
  const index = cameras.map((camera) => camera.name).indexOf(cameraName);
  activeCamera = index;
  camera = cameras[activeCamera];
}

//function to update the zoom of camera 
function cameraZoom(zoomAmount) {
  const deg = 60 - zoomAmount;
  camera.setFieldOfViews(deg);
}
//function to update the camera target
function updateTargetValue(x, y, z) {
  camera.updateTarget(x, y, z);
}