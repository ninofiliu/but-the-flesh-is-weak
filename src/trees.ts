import {
  AmbientLight,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry";

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

camera.position.set(1, 1, 1);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const green = new DirectionalLight(0x008800, 0.5);
green.position.set(-1, 0, 0);
const white = new DirectionalLight(0x888888, 0.5);
white.position.set(0, 1, 0);
const blue = new DirectionalLight(0x000088, 0.5);
blue.position.set(1, 0, 0);
const ambient = new AmbientLight(0x888888, 0.2);
scene.add(green, white, blue, ambient);

const nbCenters = 20;
const nbPoints = 40;
const nbLinkPoints = 5;
const nbSamples = 15;
const nbPaths = 3;
const nodeRadius = 0.15;

const nRandomPointsAround = (n: number, center: Vector3, dist: number) =>
  Array(n)
    .fill(null)
    .map(
      () =>
        new Vector3(
          center.x + dist * (-0.5 + Math.random()),
          center.y + dist * (-0.5 + Math.random()),
          center.z + dist * (-0.5 + Math.random())
        )
    );

const material = new MeshStandardMaterial();
const centers = nRandomPointsAround(nbCenters, new Vector3(0, 0, 0), 1);
const points = centers.map((center) =>
  nRandomPointsAround(nbPoints, center, nodeRadius)
);
for (let ci = 0; ci < centers.length; ci++) {
  scene.add(new Mesh(new ConvexGeometry(points[ci]), material));

  Array(nbSamples)
    .fill(null)
    .map(() => ~~(Math.random() * centers.length))
    .map((i) => ({
      i,
      d2:
        (centers[i].x - centers[ci].x) ** 2 +
        (centers[i].y - centers[ci].y) ** 2 +
        (centers[i].z - centers[ci].z) ** 2,
    }))
    .sort((a, b) => a.d2 - b.d2)
    .slice(0, nbPaths)
    .forEach(({ i }) => {
      if (ci === i) return;
      const link = new ConvexGeometry([
        ...points[ci].slice(0, nbLinkPoints),
        ...points[i].slice(0, nbLinkPoints),
      ]);
      scene.add(new Mesh(link, material));
    });
}

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
