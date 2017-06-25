var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth*3/4, window.innerHeight*3/4);
document.body.appendChild(renderer.domElement);

// Physics variables
var gravityConstant = -9.8;


var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x0ffff0, wireframe: true } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

geometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
material = new THREE.MeshBasicMaterial( { color: 0xffff00, } );
var fixo = new THREE.Mesh( geometry, material );
scene.add( fixo);

camera.position.z = 3;
camera.lookAt(new THREE.Vector3(0,1,0));

function animate() {
	requestAnimationFrame( animate );
  //cube.rotation.x += 0.01;
  cube.rotation.y += 0.005;
  fixo.position.y += 0.005;
	renderer.render( scene, camera );
}
animate();