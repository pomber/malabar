import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Vector3,
  Raycaster,
  Vector2,
  GridHelper,
  Clock
} from "three";
import { Mesh, SphereGeometry, MeshBasicMaterial } from "three";
import DragControls from "./drag-controls";
import animate from "./animate";

// Enable Hot Module Replacement:
if (module.hot) {
  module.hot.accept("./animate");
}

const W = document.documentElement.clientWidth;
const H = document.documentElement.clientHeight;
console.log(W, H);

const frustum = 60;
const cameraz = 10;
const lookaty = 0;

const state = {
  scene: new Scene(),
  camera: new PerspectiveCamera(frustum, W / H, 1, 1000),
  clock: new Clock(),
  balls: null
};

const renderer = new WebGLRenderer();
renderer.setSize(W, H);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
const raycaster = new Raycaster();

//window.addEventListener("resize", onWindowResize, false);
// document.addEventListener("mousedown", onDocumentMouseDown, false);
// document.addEventListener("touchstart", onDocumentTouchStart, false);

init(state);
loop(state);

function createBall(size, color) {
  return new Mesh(
    new SphereGeometry(size, 8, 8),
    new MeshBasicMaterial({ color, wireframe: true })
  );
}

function init(state) {
  state.balls = [];
  const size = 0.6;
  state.balls.push(createBall(size, 0xff0000));
  state.balls.push(createBall(size, 0x00ff00));
  state.balls.push(createBall(size, 0x0000ff));
  state.balls.forEach(ball => state.scene.add(ball));

  const gridSize = 30;
  const plane = new GridHelper(gridSize, gridSize, 0x123456);
  plane.rotation.set(Math.PI/2,0,0)
  plane.position.y += gridSize/2;
  state.scene.add(plane);

  state.camera.position.y = 0;
  state.camera.position.z = cameraz;
  state.camera.lookAt(new Vector3(0, lookaty, 0));
  var dragControls = new DragControls(
    state.balls,
    state.camera,
    renderer.domElement
  );
  dragControls.addEventListener("dragstart", function(event) {
    console.log("dragstart", event.object.position);
    state.dragging = event.object;
  });
  dragControls.addEventListener("drag", function(event) {
    // console.log("drag", event.object.position);
  });
  dragControls.addEventListener("dragend", function(event) {
    console.log("dragend", event.object.position);
    state.dragging = null;
    state.thrown = event.object;
  });
}

function loop() {
  requestAnimationFrame(loop);
  animate(state);
  renderer.render(state.scene, state.camera);
}

function onWindowResize() {
  state.camera.aspect =
    document.documentElement.clientWidth /
    document.documentElement.clientHeight;
  state.camera.updateProjectionMatrix();

  renderer.setSize(document.documentElement.clientWidth, window.clientHeight);
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
}
