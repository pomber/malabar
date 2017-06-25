import { Scene, PerspectiveCamera, WebGLRenderer, Vector3 } from "three";
import { Mesh, BoxGeometry, MeshBasicMaterial } from "three";

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
animate(state);

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

function animate() {
  requestAnimationFrame(animate);
  //cube.rotation.x += 0.01;
  state.cube.rotation.y += 0.005;
  state.fixo.position.y += 0.005;
  renderer.render(state.scene, state.camera);
}
