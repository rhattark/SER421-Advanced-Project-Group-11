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

// Load logo
const loader = new GLTFLoader();
const logoPath = 'logo/mercedes_logo/scene.gltf';

// multiple boxes
const spread = 500;
let logos = []

// loop 100 times to display 100 logos in random places around the car
for (let i = 0; i < 100; i++) {
    // Load the gltf 3d model of the mercedes logo
    loader.load(
        // resource URL
        logoPath,
        // called when the resource is loaded
        (gltf) => {
            const logo = gltf.scene;

            logo.position.x = (Math.random() - 0.5) * spread;
            logo.position.y = (Math.random() - 0.5) * spread;
            logo.position.z = (Math.random() - 0.5) * spread;
            logo.rotation.x = Math.random() * Math.PI;
            logo.rotation.y = Math.random() * Math.PI;
            const scale = Math.random() + 20;
            logo.scale.set(scale, scale, scale);
            logos.push(logo);
            scene.add(logo);
            
            renderer.render(scene, camera);
        },
        // called while loading is progressing
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        // called when loading has errors
        (error) => {
            console.error('Error loading logo', error);
        }
    );
}

// Create a new Clock object to manage time-related functionality for animations
const clock = new THREE.Clock();

// setup animation loop
function animate() {
    // Calculate the elapsed time since the start of the animation using the Clock object
    const elapsedTime = clock.getElapsedTime();

    // change rotation of all logos
    logos.forEach((logo) => {
        logo.rotation.x = elapsedTime;
        logo.rotation.y = elapsedTime;
    });

    // Updates the controls to handle user input.
    controls.update();
    // Renders the scene using the specified camera and renderer. 
    renderer.render(scene, camera);
    // Requests the next animation frame to create a continuous loop. 
    requestAnimationFrame(animate);
}

animate();
