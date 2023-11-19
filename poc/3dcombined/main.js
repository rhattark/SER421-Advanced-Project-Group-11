import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
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

// Load mercedes logo
const logoPath = 'logo/mercedes_logo/scene.gltf';

// multiple boxes
const spread = 500;
let logos = []

for (let i = 0; i < 100; i++) {
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

// Load 3d text
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
    textMesh.position.set(-60, 80, -40);
    textMesh.rotateY(-Math.PI * 0.25)
    scene.add(textMesh);

    // Add a directional light to illuminate the text mesh
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White light
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);
});

const clock = new THREE.Clock();

window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(newWidth, newHeight);
});

// setup animation loop
function animate() {
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