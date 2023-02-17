import * as THREE from "three";
import { Material } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

const my3d = new URL("../assets/FirstBuild.glb", import.meta.url);

const renderer = new THREE.WebGLRenderer();

const hdrTextureURL = new URL(
  "../assets/MR_INT-001_NaturalStudio_NAD.hdr",
  import.meta.url
);

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

renderer.outputEncoding = THREE.sRGBEncoding;

const loader = new RGBELoader();
loader.load(hdrTextureURL, function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// const pointLight = new THREE.PointLight(0xffffff, 2, 300);
// scene.add(pointLight);
// pointLight.position.set(20, 20, 20);

renderer.setClearColor(0xa3a3a3);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(10, 10, 10);
orbit.update();

const grid = new THREE.GridHelper(30, 30);
scene.add(grid);

const assetLoader = new GLTFLoader();

assetLoader.load(
  my3d.href,
  function (gltf) {
    const model = gltf.scene;
    // const yo= new THREE.Mesh(
    //   new THREE.model(),
    //   new THREE.MeshStandardMaterial({
    //     roughness:0
    //   })
    // )

    scene.add(model);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

function animate() {
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
