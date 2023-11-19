import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// Add a directional light to cast shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Set up shadow properties for the light
directionalLight.shadow.mapSize.width = 1024; // default
directionalLight.shadow.mapSize.height = 1024; // default
directionalLight.shadow.camera.near = 0.5; // default
directionalLight.shadow.camera.far = 500; // default

// Create a box with shadows
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true; // Enable shadow casting
cube.receiveShadow = true; // Enable shadow receiving
scene.add(cube);

// multiple boxes
const spread = 20;
let cubes = []

for (let i = 0; i < 100; i++) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true; // Enable shadow casting
    cube.receiveShadow = true; // Enable shadow receiving

    cube.position.x = (Math.random() - 0.5) * spread;
    cube.position.y = (Math.random() - 0.5) * spread;
    cube.position.z = (Math.random() - 0.5) * spread;
    cube.rotation.x = Math.random() * Math.PI;
    cube.rotation.y = Math.random() * Math.PI;
    const scale = Math.random();
    cube.scale.set(scale, scale, scale);
    cubes.push(cube);
    scene.add(cube);
}

camera.position.z = 5;
const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    cubes.forEach((cube) => {
        cube.rotation.x = elapsedTime;
        cube.rotation.y = elapsedTime;
    });

    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();
