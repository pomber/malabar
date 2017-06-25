import { Scene, PerspectiveCamera, WebGLRenderer, Vector3 } from "three";
import { Mesh, BoxGeometry, MeshBasicMaterial } from "three";
import animate from "./animate";

// Enable Hot Module Replacement:
if (module.hot) {
  module.hot.accept("./animate");
}

const W = window.innerWidth;
const H = window.innerHeight;
const GY = -9.8;

const state = {
  scene: new Scene(),
  camera: new PerspectiveCamera(70, W / H, 1, 1000),
  cube: null,
  fixo: null
};

const renderer = new WebGLRenderer();
renderer.setSize(W, H);
document.body.appendChild(renderer.domElement);

init(state);
loop(state);

function init(state) {
  state.cube = new Mesh(
    new BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({
      color: 0x0ffff0,
      wireframe: true
    })
  );
  state.scene.add(state.cube);

  state.fixo = new Mesh(
    new BoxGeometry(0.5, 0.5, 0.5),
    new MeshBasicMaterial({ color: 0xffff00 })
  );
  state.scene.add(state.fixo);

  state.camera.position.y = -2;
  state.camera.position.z = 3;
  state.camera.lookAt(new Vector3(0, 3.5, 0));
}

function loop() {
  requestAnimationFrame(loop);
  animate(state);
  renderer.render(state.scene, state.camera);
}
