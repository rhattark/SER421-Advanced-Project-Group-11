import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader.js';
import { Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// source: https://akashhamirwasia.com/blog/create-stunning-3D-text-with-custom-fonts-in-threejs/#mesh-and-material

// scene and camera setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50; // Position the camera closer to the text mesh

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1); // Set background color to black
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const ttfLoader = new TTFLoader();

// Load the TTF font file from Fontsource CDN. Can also be the link to font file from Google Fonts
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
    // Update positioning of the text
    textMesh.position.set(0, 0, 0);
    scene.add(textMesh);

    // Add a directional light to illuminate the text mesh
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White light
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);
});

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // Soft white ambient light
scene.add(ambientLight);

window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(newWidth, newHeight);
});

// Render the scene using the renderer
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();
