import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// scene and camera setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// camera positioning
camera.position.z = 50;
camera.position.y += 1; // Raise the camera slightly to see the floor

// setup renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);

// add renderer to html
document.body.appendChild(renderer.domElement);

// orbit controls to move 3d object with mouse
const controls = new OrbitControls(camera, renderer.domElement);

// light setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// Add a directional light to cast shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// add floor below the car
const floorGeometry = new THREE.CircleGeometry(80, 360);

// Load the texture for the floor
const floorTexture = new THREE.TextureLoader().load('textures/textured-floor.avif');

// Create a basic material and apply the texture
const floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });

// Combine geometry and material of the floor in a mesh
const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
floorMesh.position.z = 40; // Position the floor slightly below the car
floorMesh.position.x = -60;
floorMesh.rotation.x = -Math.PI / 2;
scene.add(floorMesh);

// Load car
const loader = new GLTFLoader();
const carPath = 'merc/scene.gltf';

// changing the camera position for the car
function setCameraPositionForCar(car) {
    const boundingBox = new THREE.Box3().setFromObject(car);
    const center = boundingBox.getCenter(new THREE.Vector3());

    // Set the camera position based on the car's bounding box
    camera.position.copy(center);
    camera.position.z += boundingBox.max.z + 30;
    camera.position.y = 50;
    camera.position.x = -200;

    // Optionally, you can adjust the orbit controls target to center on the car
    controls.target.copy(center);
}

// Load the gltf 3d model of the car
loader.load(
    // resource URL
    carPath,
    // called when the resource is loaded
    (gltf) => {
        const car = gltf.scene;
        scene.add(car);
        setCameraPositionForCar(car);
        renderer.render(scene, camera);
    },
    // called while loading is progressing
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    // called when loading has errors
    (error) => {
        console.error('Error loading car', error);
    }
);

// setup animation loop
function animate() {
    // Updates the controls to handle user input.
    controls.update();
    // Renders the scene using the specified camera and renderer. 
    renderer.render(scene, camera);
    // Requests the next animation frame to create a continuous loop. 
    requestAnimationFrame(animate);
}

animate();