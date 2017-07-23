import { Vector3 } from "three";

const G = new Vector3(0, -9.8, 0).multiplyScalar(0.02);
const XW = 2.5;
const CAMERA_Z = 10;

export default state => {
  // thrown is set to a ball when a ball was thrown
  // dragging is set to a ball when the user starts dragging it
  const { clock, balls, thrown, dragging } = state;
  const delta = clock.getDelta();

  if (thrown) {
    console.log("thrown at ", thrown.userData.speed);
    state.thrown = null;
  }

  balls.forEach(ball => {
    const position = ball.position;
    const data = ball.userData;
    const speed = data.speed || new Vector3(0, 0, 0);

    if (ball == dragging) {
      const moved = position.clone().sub(data.prevPosition);
      data.speed = moved.multiplyScalar(1 / delta);
      data.prevPosition = position.clone();
      return;
    }

    data.prevPosition = position.clone();
    data.speed = speed;

    if (ball != dragging) {
      speed.add(G);
      position.addScaledVector(speed, delta);
    }

    if (position.y < 0) {
      speed.y = 0;
      position.y = 0;
    }

    if (position.x < -XW) {
      speed.x = 0;
      position.x = -XW;
    }

    if (position.x > XW) {
      speed.x = 0;
      position.x = XW;
    }
  });

  const ys = balls.map(b => b.position.y);
  const maxy = Math.max(...ys);
  state.camera.lookAt(new Vector3(0, 5, 0));
  // console.log("maxy", maxy);

  return state;
};

const halfalpha = Math.atan(5, CAMERA_Z);
const alpha = 2 * halfalpha;

function moveCamera(camera, maxy) {
  const t = maxy < 15 ? 15 : maxy;
  const T = alpha;
  const z = CAMERA_Z;
  const Z = Math.asin(z * Math.sin(T) / t);
  // const c = Math.sqrt()
  const C = Math.PI - Z - T;
  const c = Math.sin(C) * t / Math.sin(T);

  const ny = Math.cos(C) * z;
  const nz = Math.sin(C) * z;

  const NY = Math.asin(ny / z);
  const NZ = Math.PI / 2 - NY - T / 2;

  const nt = z * Math.sin(T/2) / Math.sin(NZ);

  camera.lookAt(new Vector3(0, nt, 0));
  camera.position.y = -ny;
  camera.position.z = nz;
  console.log(maxy, nt, ny, nz);
}
