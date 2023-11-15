import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// scene and camera setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// light setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
const loader = new GLTFLoader();
const modelPath = 'merc/scene.gltf';

function setCameraPositionForModel(model) {
    const boundingBox = new THREE.Box3().setFromObject(model);
    const center = boundingBox.getCenter(new THREE.Vector3());

    // Set the camera position based on the model's bounding box
    camera.position.copy(center);
    camera.position.z += boundingBox.max.z;

    // Optionally, you can adjust the orbit controls target to center on the model
    controls.target.copy(center);
}

loader.load(
    // resource URL
    modelPath,
    // called when the resource is loaded
    (gltf) => {
        const model = gltf.scene;
        scene.add(model);
        setCameraPositionForModel(model);
        renderer.render(scene, camera);
    },
    // called while loading is progressing
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    // called when loading has errors
    (error) => {
        console.error('Error loading model', error);
    }
);

function animate() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();