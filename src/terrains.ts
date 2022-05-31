import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.style.margin = "0";
document.body.style.overflow = "hidden";
document.body.appendChild(renderer.domElement);

const scene = new Scene();
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const controls = new OrbitControls(camera, renderer.domElement);
const axesHelper = new AxesHelper(1);
scene.add(axesHelper);

camera.position.set(1, 1, 1);
controls.update();

const cube = new Mesh(
  new BoxGeometry(1, 1, 1),
  new MeshStandardMaterial({
    roughness: 0.5,
    metalness: 0.5,
  })
);
scene.add(cube);

const pointLight = new PointLight(0xffffff, 1);
pointLight.position.set(0, 2, 0);
const ambientLight = new AmbientLight(0xffffff, 0.1);
scene.add(pointLight, ambientLight);

const animate = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};
animate();

window.addEventListener(
  "resize",
  () => {
    debugger;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    controls.update();
    renderer.setSize(window.innerWidth, window.innerHeight);
  },
  false
);
