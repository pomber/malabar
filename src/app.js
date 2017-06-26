import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Vector3,
  Raycaster,
  Vector2,
	Clock
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

const state = {
  scene: new Scene(),
  camera: new PerspectiveCamera(40, W / H, 1, 1000),
	clock: new Clock(),
  balls: null,
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
	state.balls = [];
	const size = 0.3;
  state.balls.push(new Mesh(
    new SphereGeometry(size, 8, 8),
    new MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true
    })
  ));
  state.balls.push(new Mesh(
    new SphereGeometry(size, 8, 8),
    new MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true
    })
  ));
  state.balls.push(new Mesh(
    new SphereGeometry(size, 8, 8),
    new MeshBasicMaterial({
      color: 0x0000ff,
      wireframe: true
    })
  ));

	state.balls.forEach(ball => state.scene.add(ball));

  state.camera.position.y = -2;
  state.camera.position.z = 6;
  state.camera.lookAt(new Vector3(0, 2, 0));
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
