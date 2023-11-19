import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader.js';
import { Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

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

// Load 3d text
const ttfLoader = new TTFLoader();

// Load the TTF font file from public/fonts directory
ttfLoader.load('fonts/Cardo-Regular.ttf', (fontData) => {
    // Convert the parsed fontData to the format Three.js understands
    const font = new Font(fontData);

    // Create the text geometry
    const textGeometry = new TextGeometry('G-Class', {
        font: font,
        size: 15,
        height: 5,
        curveSegments: 32,
        bevelEnabled: true,
        bevelThickness: 0.5,
        bevelSize: 0.5,
        bevelSegments: 8,
    });
    textGeometry.center();

    // Create a standard material with red color and 50% gloss
    const material = new THREE.MeshStandardMaterial({
        color: 'lightgrey',
        roughness: 0.5
    });

    // Geometries are attached to meshes so that they get rendered
    const textMesh = new THREE.Mesh(textGeometry, material);
    // Update positioning of the text - this will change once added to combined page
    textMesh.position.set(0, 0, 0);
    scene.add(textMesh);

    // Add a directional light to illuminate the text mesh
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White light
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);
});

// Render the scene using the renderer
function animate() {
    // Updates the controls to handle user input.
    controls.update();
    // Renders the scene using the specified camera and renderer. 
    renderer.render(scene, camera);
    // Requests the next animation frame to create a continuous loop. 
    requestAnimationFrame(animate);
}

animate();
