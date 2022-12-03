var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87CEEB);
document.getElementById("scene").appendChild(renderer.domElement);
camera.position.set(0, -22, 13);
camera.rotation.set(1, 0, 0);

//Controls
let controls = new THREE.OrbitControls(camera, renderer.domElement);

//Cube
let cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
let cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

scene.add(cube);

//Plane
let planeGeometry = new THREE.BoxGeometry(50, 50, 1);
let planeMaterial = new THREE.MeshLambertMaterial({color: 0x3ce63c});
let plane = new THREE.Mesh(planeGeometry, planeMaterial);

plane.position.z = -1.5;
scene.add(plane);

//Lights
let spotlight = new THREE.SpotLight(0xffffff, 3, undefined, 1.3, 1);
spotlight.position.set(0, 0, 10);
scene.add(spotlight);

let ambient = new THREE.AmbientLight(0xffffff, 0.75);
scene.add(ambient);

//Loader
let loader = new THREE.GLTFLoader();
function load(asset, pos=[0, 0, 0], rot=[-Math.PI / 2, Math.PI, Math.PI], scale=[5, 5, 5]){
    loader.load(`Assets/${asset}.glb`, function(object){
        object.scene.position.set(pos[0], pos[1], pos[2]);
        object.scene.rotation.set(rot[0], rot[1], rot[2]);
        object.scene.scale.set(scale[0], scale[1], scale[2]);
        scene.add(object.scene);
    });
};

load('platform_grass', [-5, 4, -0.5]);
load('platform_grass', [-2, 3, -0.5], undefined, [5, 10, 5]);
load('rock_largeA', [1, 3, -1], undefined, [2, 2, 2]);
load('plant_bushDetailed', [-5, 1, -1], undefined, [3, 3, 3]);
load('plant_bushDetailed', [-2, 6, -1], undefined, [3, 3, 3]);


function render(){
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    cube.rotation.z += 0.01;

    controls.update();
}

render();