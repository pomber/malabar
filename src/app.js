import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Vector3,
  Raycaster,
  Vector2
} from "three";
import { Mesh, SphereGeometry, MeshBasicMaterial } from "three";
import DragControls from "./drag-controls";
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
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
const raycaster = new Raycaster();

window.addEventListener("resize", onWindowResize, false);
// document.addEventListener("mousedown", onDocumentMouseDown, false);
// document.addEventListener("touchstart", onDocumentTouchStart, false);

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
    new SphereGeometry(0.5, 4, 4),
    new MeshBasicMaterial({
      color: 0xffff00,
      wireframe: true
    })
  );
  state.scene.add(state.fixo);

  state.camera.position.y = -3;
  state.camera.position.z = 4;
  state.camera.lookAt(new Vector3(0, 2.5, 0));

  const objects = [state.cube, state.fixo];
  var dragControls = new DragControls(
    objects,
    state.camera,
    renderer.domElement
  );
  dragControls.addEventListener("dragstart", function(event) {
    console.log("dragstart", event.object.position);
  });
  dragControls.addEventListener("dragend", function(event) {
    console.log("dragend", event.object.position);
  });
}

function loop() {
  requestAnimationFrame(loop);
  animate(state);
  renderer.render(state.scene, state.camera);
}

function onWindowResize() {
  state.camera.aspect = window.innerWidth / window.innerHeight;
  state.camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentTouchStart(event) {
  event.preventDefault();

  event.clientX = event.touches[0].clientX;
  event.clientY = event.touches[0].clientY;
  onDocumentMouseDown(event);
}

function onDocumentMouseDown(event) {
  event.preventDefault();

  const mouse = new Vector2();
  mouse.x = event.clientX / renderer.domElement.clientWidth * 2 - 1;
  mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, state.camera);

  const objects = [state.cube, state.fixo];
  const intersects = raycaster.intersectObjects(objects);

  if (intersects.length > 0) {
    intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
    console.log(intersects[0].point);
  }
}
