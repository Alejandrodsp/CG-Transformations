var config = { rotate: degToRad(20), translateX: 0, translateY: 0, translateZ: 0};
const manageModels = {
  addModel: () => { main(); },
};
const loadGUI = () => {
  const gui = new dat.GUI();
  gui.add(manageModels, 'addModel').name('Add new model');
  gui.add(config, "rotate", 0, 20, 0.50);
  gui.add(config, "translateX", -100, 100, 10);
  gui.add(config, "translateY", -100, 100, 10);
  gui.add(config, "translateZ", -100, 100, 10);
};
