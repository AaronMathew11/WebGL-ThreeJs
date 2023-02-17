import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DirectionalLight, Mesh, Raycaster } from "three";
import nebula from "../images/nebula.jpg";
import stars from "../images/stars.jpg";

const renderer = new THREE.WebGL1Renderer();

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

camera.position.set(-10, 30, 30);
orbit.update();

//ADDING SHAPES

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x0000ff,
  wireframe: false,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.castShadow = true;

sphere.position.set(-10, 10, 0);

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
// scene.add(directionalLight);
// directionalLight.position.set(-30, 50, 0);
// directionalLight.castShadow=true;
// directionalLight.shadow.camera.bottom=-12;

// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(dLightHelper);

// const dLightShadowHelper= new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(dLightShadowHelper);

//Spotlight
const spotLight = new THREE.SpotLight(0xffffff);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

// scene.fog= new THREE.Fog(0xffffff,0,200);
scene.fog = new THREE.FogExp2(0xffffff, 0.01);

//renderer.setClearColor(0xffea00);

//Background image
const textureLoader = new THREE.TextureLoader();
//scene.background= textureLoader.load(stars);

// const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = new THREE.CubeTextureLoader().load([
  nebula,
  nebula,
  stars,
  stars,
  stars,
  stars,
]);

const box2MultiMaterial = [
  new THREE.MeshBasicMaterial({ map: textureLoader.load(nebula) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(nebula) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(nebula) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(nebula) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
];
const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
const box2Material = new THREE.MeshBasicMaterial({
  map: textureLoader.load(nebula),
});
const box2 = new THREE.Mesh(box2Geometry, box2MultiMaterial);
scene.add(box2);
box2.position.set(0, 15, 10);

//GRID
const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

//GUI FOR HELP
const gui = new dat.GUI();
const options = {
  sphereColor: "#ffea00",
  wireframe: false,
};

gui.addColor(options, "sphereColor").onChange(function (e) {
  sphere.material.color.set(e);
});

let step = 0;
let speed = 0.01;

gui.add(options, "wireframe").onChange(function (e) {
  sphere.material.wireframe = e;
});

const mousePosition = new THREE.Vector2();

window.addEventListener("mousemove", function (e) {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

const sphereId = sphere.id;
box2.name = "theBox";

const rayCaster = new THREE.Raycaster();

//The loop animation function
function animate() {
  box.rotation.x += 0.01;
  box.rotation.y += 0.01;

  step += speed;
  sphere.position.y = 10 * Math.abs(Math.sin(step));

  rayCaster.setFromCamera(mousePosition, camera);
  const intersects = rayCaster.intersectObjects(scene.children);
  console.log(intersects);

  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object.id === sphereId)
      intersects[i].object.material.color.set(0xff0000);

    if (intersects[i].object.name === "theBox") {
      intersects[i].object.rotation.x += 0.01;
      intersects[i].object.rotation.y += 0.01;
    }
  }

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
// two types of cameras :
// orthographic - depth does not matter
// perspective - depth matters

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / this.window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, windo.innerHeight);
});
