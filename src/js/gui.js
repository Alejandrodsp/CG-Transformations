import {main} from './script.js';


export const loadGUI = () => {
  var config = {add: function(){main()},rotate: degToRad(20), translateX: 0, translateY: 0, translateZ: 0};
  const gui = new dat.GUI();
  gui.add(config, 'add');
  gui.add(config, "rotate", 0, 20, 0.5);
  gui.add(config, "translateX", -100, 100, 10);
  gui.add(config, "translateY", -100, 100, 10);
  gui.add(config, "translateZ", -100, 100, 10);
};
