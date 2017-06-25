import { Scene, PerspectiveCamera, WebGLRenderer, Vector3 } from "three";
import { Mesh, BoxGeometry, MeshBasicMaterial } from "three";

const W = window.innerWidth;
const H = window.innerHeight;
const GY = -9.8;

const scene = new Scene();
const camera = new PerspectiveCamera(70, W / H, 1, 1000);
const renderer = new WebGLRenderer();
renderer.setSize(W, H);

document.body.appendChild(renderer.domElement);

let cube, fixo;
init();
animate();

function init() {
  cube = new Mesh(
    new BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({
      color: 0x0ffff0,
      wireframe: true
    })
  );
  scene.add(cube);

  fixo = new Mesh(
    new BoxGeometry(0.5, 0.5, 0.5),
    new MeshBasicMaterial({ color: 0xffff00 })
  );
  scene.add(fixo);

  camera.position.y = -2;
  camera.position.z = 3;
  camera.lookAt(new Vector3(0, 3.5, 0));
}

function animate() {
  requestAnimationFrame(animate);
  //cube.rotation.x += 0.01;
  cube.rotation.y += 0.005;
  fixo.position.y += 0.005;
  renderer.render(scene, camera);
}
