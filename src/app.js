import { Scene, PerspectiveCamera, WebGLRenderer, Vector3 } from "three";
import { Mesh, SphereGeometry, MeshBasicMaterial } from "three";
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
    new SphereGeometry(1, 8, 8),
    new MeshBasicMaterial({
      color: 0x0ffff0,
      wireframe: true
    })
  );
  state.scene.add(state.cube);

  state.fixo = new Mesh(
    new SphereGeometry(0.5, 16, 16),
    new MeshBasicMaterial({
      color: 0xffff00,
      wireframe: true
    })
  );
  state.scene.add(state.fixo);

  state.camera.position.y = -3;
  state.camera.position.z = 4;
  state.camera.lookAt(new Vector3(0, 2.5, 0));
}

function loop() {
  requestAnimationFrame(loop);
  animate(state);
  renderer.render(state.scene, state.camera);
}
