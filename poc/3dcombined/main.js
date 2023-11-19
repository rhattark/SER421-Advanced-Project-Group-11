import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;
camera.position.y += 1; // Raise the camera slightly to see the floor

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

// add floor below the car
const floorGeometry = new THREE.CircleGeometry(80, 360);

const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    side: THREE.DoubleSide,
});

const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
floorMesh.position.z = 40; // Position the floor slightly below the car
floorMesh.position.x = -60;
floorMesh.rotation.x = -Math.PI / 2;
scene.add(floorMesh);

const floorTexture = new THREE.TextureLoader().load('textured-floor.avif', () => {
    // This callback ensures the texture is loaded before rendering
    floorMaterial.map = floorTexture;
    floorMaterial.needsUpdate = true;
});

// Load car
const loader = new GLTFLoader();
const carPath = 'merc/scene.gltf';

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

const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    logos.forEach((logo) => {
        logo.rotation.x = elapsedTime;
        logo.rotation.y = elapsedTime;
    });

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();