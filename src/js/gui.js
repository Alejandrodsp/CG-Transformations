//Models Properties
const manageModels = {
  addModel: () => { addMod(); },
  deleteModel: () => { },
  lookAtModel: false,
};

// Animations Properties
const animation = {
  playAnimation: () => {
    models[animation.selectModel - 1].animation(
      animation.firstAnimation,
      animation.secondAnimation,
      false, //booleans used to perform the inverse of animations 
      false
    );
  },
  firstAnimation: {
    type: 'translation',
    axis: 'x',
    direction: 'positive',
    amount: 0,
  },
  secondAnimation: {
    type: 'translation',
    axis: 'x',
    direction: 'positive',
    amount: 0,
  },
  selectModel: [],
};

//Cameras Properties
const cam = {
  zoom: 0,
  chooseCamera: 'Center Camera',
  point: { x: 0, y: 0, z: 0, },
  look: () => { updateTargetValue(cam.point.x, cam.point.y, cam.point.z); },
  curve: { angle: 0, },
  pRotation: { xp: 0, yp: 0, zp: 0, ap: 0, },
};

// Camera Animations Properties
const camAnimation = {
  playCamAnimation: () => {
    camera.camAnimation(
      camAnimation.firstCamAnimation,
      camAnimation.secondCamAnimation,
      false, //booleans used to perform the inverse of camera animations 
      false
    );
  },
  firstCamAnimation: {
    type: 'translation',
    axis: 'x',
    direction: 'positive',
    amount: 0,
  },
  secondCamAnimation: {
    type: 'translation',
    axis: 'x',
    direction: 'positive',
    amount: 0,
  },
};

//Load Gui
const loadGUI = () => {
  let gui = new dat.GUI();

  // addModel button
  gui
    .add(manageModels, 'addModel')
    .onChange(() => {
      setTimeout(addNewController, 50, gui, updateSelectModelCB);
    })
    .name('Add new model');

  // camera controllers
  gui = configureCameraGui(gui);

  // animation controllers
  var selectModelControl;
  var animationFolder;
  ({ gui, animationCamFolder } = configureAnimationsCamGui(gui));

  // camera animation controllers
  var animationCamFolder;
  ({ gui, selectModelControl, animationFolder } = configureAnimationsGui(gui));

  function updateSelectModelCB() {
    selectModelControl = updateSelectModel(selectModelControl, animationFolder);
  }

};

//Camera controllers configs
function configureCameraGui(gui) {
  const cameraFolder = gui.addFolder('Camera');

  // choose camera
  cameraFolder
    .add(cam, 'chooseCamera')
    .options(['Right Camera', 'Center Camera', 'Left Camera'])
    .onChange(() => {
      changeCamera(cam.chooseCamera);
      updateCameraControllers();
    })
    .name('Change Camera');
  
  //Camera operations folders
  const cameraTranslateFolder = cameraFolder.addFolder('Translation');
  const cameraCurveTranslationFolder = cameraFolder.addFolder('Curve Translation');
  const cameraRotationFolder = cameraFolder.addFolder('Rotation');
  const cameraPointRotationFolder = cameraFolder.addFolder('Point Rotation');
  const cameraLookAtFolder = cameraFolder.addFolder('Look at point');
  
  //Camera control options
  var cameraControls = [];
  addCameraControls();

  function updateCameraControllers() {
    cameraControls.forEach((control) => {
      control.remove();
    });
    cameraControls = [];
    addCameraControls();
  }

  //function to add camera controls
  function addCameraControls() {
    //Zoom
    cameraControls.push(
      cameraFolder.add(cam, 'zoom', 0, 59, 1).onChange(() => {
        cameraZoom(cam.zoom);
      })
    );

    //Translation
    cameraControls.push(
      cameraTranslateFolder.add(camera.position, 'x', -360, 360, 1)
    );
    cameraControls.push(
      cameraTranslateFolder.add(camera.position, 'y', -360, 360, 1)
    );
    cameraControls.push(
      cameraTranslateFolder.add(camera.position, 'z', -360, 360, 5)
    );

    //Curve translation
    cameraControls.push(
      cameraCurveTranslationFolder.add(camera.curve, 'c', -50, 50, 1).name('Angle')
    );

    //Rotation
    cameraControls.push(
      cameraRotationFolder.add(camera.rotation, 'x', -20, 20, 0.1)
    );
    cameraControls.push(
      cameraRotationFolder.add(camera.rotation, 'y', -20, 20, 0.1)
    );
    cameraControls.push(
      cameraRotationFolder.add(camera.rotation, 'z', -20, 20, 0.1)
    );

    //Point rotation
    cameraControls.push(
      cameraPointRotationFolder.add(camera.rotationP, 'xp').name('x')
    );
    cameraControls.push(
      cameraPointRotationFolder.add(camera.rotationP, 'yp').name('y')
    );
    cameraControls.push(
      cameraPointRotationFolder.add(camera.rotationP, 'zp').name('z')
    );
    cameraControls.push(
      cameraPointRotationFolder.add(camera.rotationP, 'ap', -50, 50, 0.1).name('Rotation')
    );

    //Look at point
    cameraControls.push(
      cameraLookAtFolder.add(cam.point, 'x')
    );
    cameraControls.push(
      cameraLookAtFolder.add(cam.point, 'y')
    );
    cameraControls.push(
      cameraLookAtFolder.add(cam.point, 'z')
    );
    cameraControls.push(
      cameraLookAtFolder.add(cam, 'look').name('Look')
    );
  }

  return gui;
}

//Animations camera controllers configs
function configureAnimationsCamGui(gui) {
  const animationCamFolder = gui.addFolder('Camera Animations');

  animationCamFolder.add(camAnimation, 'playCamAnimation').name('Play Animation');

  //First animation
  const firstCamAnimationFolder = animationCamFolder.addFolder('First Camera Animation');
    firstCamAnimationFolder
    .add(camAnimation.firstCamAnimation, 'type')
    .options(['translation', 'rotation']);
    firstCamAnimationFolder
    .add(camAnimation.firstCamAnimation, 'axis')
    .options(['x', 'y', 'z']);
    firstCamAnimationFolder
    .add(camAnimation.firstCamAnimation, 'direction')
    .options(['positive', 'negative']);
    firstCamAnimationFolder
    .add(camAnimation.firstCamAnimation, 'amount', 0, 10, 0.5)
    .name('Duration (s):');

  //Second animation
  const secondCamAnimationfFolder = animationCamFolder.addFolder('Second Camera Animation');
    secondCamAnimationfFolder
    .add(camAnimation.secondCamAnimation, 'type')
    .options(['translation', 'rotation']);
    secondCamAnimationfFolder
    .add(camAnimation.secondCamAnimation, 'axis')
    .options(['x', 'y', 'z']);
    secondCamAnimationfFolder
    .add(camAnimation.secondCamAnimation, 'direction')
    .options(['positive', 'negative']);
    secondCamAnimationfFolder
    .add(camAnimation.secondCamAnimation, 'amount', 0, 10, 0.5)
    .name('Duration (s):')

  return {
    gui,
    animationCamFolder,
  };
}

//Animations controllers configs
function configureAnimationsGui(gui) {
  const animationFolder = gui.addFolder('Animations');
  animationFolder.add(animation, 'playAnimation').name('Play Animation');

  //First animation
  const firstAnimationFolder = animationFolder.addFolder('First Animation');
    firstAnimationFolder
    .add(animation.firstAnimation, 'type')
    .options(['translation', 'rotation']);
    firstAnimationFolder
    .add(animation.firstAnimation, 'axis')
    .options(['x', 'y', 'z']);
    firstAnimationFolder
    .add(animation.firstAnimation, 'direction')
    .options(['positive', 'negative']);
    firstAnimationFolder
    .add(animation.firstAnimation, 'amount', 0, 10, 0.5)
    .name('Duration (s):');

  //Second animation
  const secondAnimationFolder = animationFolder.addFolder('Second Animation');
    secondAnimationFolder
    .add(animation.secondAnimation, 'type')
    .options(['translation', 'rotation']);
    secondAnimationFolder
    .add(animation.secondAnimation, 'axis')
    .options(['x', 'y', 'z']);
    secondAnimationFolder
    .add(animation.secondAnimation, 'direction')
    .options(['positive', 'negative']);
    secondAnimationFolder
    .add(animation.secondAnimation, 'amount', 0, 10, 0.5)
    .name('Duration (s):')
    .options();

  //Select model
  var selectModelControl = animationFolder
    .add(animation, 'selectModel', animation.selectModel)
    .name('Select Model');

  return {
    gui,
    selectModelControl,
    animationFolder,
  };

}

//Function to update the selected model
function updateSelectModel(control, animationFolder) {
  control.remove();
  control = animationFolder.add(
    animation,
    'selectModel',
    animation.selectModel
  );

  return control;
}

//Models Controllers Configs
function addNewController(gui, updateSelectModelCB) {
  const index = models.length - 1;
  let model = models[index];
  const modelFolder = gui.addFolder('Model-' + models.length);

  //Delete model
  modelFolder
    .add(manageModels, 'deleteModel')
    .onChange(() => {
      gui.removeFolder(modelFolder);
      removeMod(index);
      updateSelectModelCB();
    })
    .name('Delete Model');

  //Look at a model
  modelFolder
    .add(manageModels, 'lookAtModel')
    .onChange((evt) => {
      if (evt === true) {
        updateTargetValue(
          model.translation.x,
          model.translation.y,
          model.translation.z
        );
        model.target = 1
      } else {
        updateTargetValue(0, 0, 0);
        model.target = -1
      }
    })
    .name('Look at this model');
  
  //Models folders
  const modelTranslateFolder = modelFolder.addFolder('Translation');
  const modelRotationFolder = modelFolder.addFolder('Rotation');
  const modelPointRotationFolder = modelFolder.addFolder('Point Rotation');
  const modelScaleFolder = modelFolder.addFolder('Scale');

  //Translation
  modelTranslateFolder.add(model.translation, 'x', -200, 200, 5);
  modelTranslateFolder.add(model.translation, 'y', -200, 200, 5);
  modelTranslateFolder.add(model.translation, 'z', -200, 200, 5);
  modelTranslateFolder.add(model.translation, 'c', -50, 50, 1).name('Curve');

  //Rotation
  modelRotationFolder.add(model.rotation, 'x', -20, 20, 0.5);
  modelRotationFolder.add(model.rotation, 'y', -20, 20, 0.5);
  modelRotationFolder.add(model.rotation, 'z', -20, 20, 0.5);

  //Point rotation
  modelPointRotationFolder.add(model.rotation, 'xPoint').name('x');
  modelPointRotationFolder.add(model.rotation, 'yPoint').name('y');
  modelPointRotationFolder.add(model.rotation, 'zPoint').name('z');
  modelPointRotationFolder.add(model.rotation, 'r', -50, 50, 0.5).name('Rotation');

  //Scale
  modelScaleFolder.add(model.scale, 'x', 0, 10, 0.1);
  modelScaleFolder.add(model.scale, 'y', 0, 10, 0.1);
  modelScaleFolder.add(model.scale, 'z', 0, 10, 0.1);
  modelScaleFolder.add(model.scale, 'factor', 0, 10, 0.01).name('Keep aspect ratio');

  updateSelectModelCB();
}
