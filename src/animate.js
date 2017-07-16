import { Vector3 } from "three";

const G = new Vector3(0, -9.8, 0).multiplyScalar(0.1);
const XW = 2.5;

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

  return state;
};
