var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87CEEB);
document.getElementById("scene").appendChild(renderer.domElement);

camera.position.set(0, -22, 13);
camera.rotation.set(1, 0, 0);
camera.up.set(0, 0, 1);

//Loaders
let loadingManager = new THREE.LoadingManager();

loadingManager.onProgress = function(url, loaded, total){
    document.getElementById('loading-progress').value = Math.round((loaded / total) * 100);
    document.getElementById('loading-progress-label').innerHTML = `${Math.round((loaded / total) * 100)}%`;
}

function fadeOutEffect(fadeTarget) {
    var fadeEffect = setInterval(function () {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.02;
        } else {
            fadeTarget.style.display = 'none';
            clearInterval(fadeEffect);
        }
    }, 10);
}

let statusDiv = document.getElementById('loading-progress-status');
function changeStatus(){
    if(statusDiv.innerHTML == 'Loading.'){
        statusDiv.innerHTML = 'Loading..';
    } else if(statusDiv.innerHTML == 'Loading..'){
        statusDiv.innerHTML = 'Loading...';
    } else if(statusDiv.innerHTML == 'Loading...'){
        statusDiv.innerHTML = 'Loading.';
    }
}
let loadingStatus = setInterval(changeStatus, 500);

loadingManager.onLoad = function() {
    fadeOutEffect(document.getElementById("loading"));
}

let coins = [];
let loader = new THREE.GLTFLoader(loadingManager);
let loadingScreenGLTF = new THREE.GLTFLoader();

//Loading screen
let scene2 = new THREE.Scene();
let camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer2 = new THREE.WebGLRenderer({alpha: true});

renderer2.setSize(window.innerWidth, window.innerHeight);
renderer2.setClearColor(0x000000, 0);
document.getElementById("loading").appendChild(renderer2.domElement);

let spot2 = new THREE.SpotLight(0xffffff, 3);
spot2.position.z = 5;
scene2.add(spot2);

let flag;
loadingScreenGLTF.load('Assets/flag.glb', function(object){
    scene2.add(object.scene);
    flag = object.scene;
})

camera2.position.z = 5;

//Controls
let controls = new THREE.OrbitControls(camera, renderer.domElement);

//Cube
let cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
let cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

cube.rotation.z = Math.PI / 2;
cube.position.z = -0.5;
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

//Loading function
function load(asset, pos=[0, 0, 0], rot=[-Math.PI / 2, Math.PI, Math.PI], scale=[5, 5, 5], appendTo){
    loader.load(`Assets/${asset}.glb`, function(object){
        object.scene.position.set(pos[0], pos[1], pos[2]);
        object.scene.rotation.set(rot[0], rot[1], rot[2]);
        object.scene.scale.set(scale[0], scale[1], scale[2]);
        object.scene.name = asset;

        scene.add(object.scene);

        if(appendTo != undefined){
            appendTo.push(object.scene);
        }
    }, loadingManager.onProgress(undefined, 100, 1000));

    changeStatus();
};

//Decoration
load('platform_grass', [-5, 4, -0.5]);
load('platform_grass', [-2, 3, -0.5], undefined, [5, 10, 5]);
load('rock_largeA', [1, 3, -1], undefined, [2, 2, 2]);
load('plant_bushDetailed', [-5, 1, -1], undefined, [3, 3, 3]);
load('plant_bushDetailed', [-2, 6, -1], undefined, [3, 3, 3]);

//Collectables
function randomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

for(let i = 0; i < 10; i++){
    load('coinGold', [randomInt(-20, 20), randomInt(-20, 20), -1], undefined, [2, 2, 2], coins);
}

for(let i = 0; i < 10; i++){
    load('coinSilver', [randomInt(-20, 20), randomInt(-20, 20), -1], undefined, [2, 2, 2], coins);
}

for(let i = 0; i < 10; i++){
    load('coinBronze', [randomInt(-20, 20), randomInt(-20, 20), -1], undefined, [2, 2, 2], coins);
}


let keyboard = {};
let player = {
    speed: 0.1
}

function player_movement() {
    if(keyboard[37]){ //left arrow key
        cube.rotation.z += Math.PI * 0.01;
    }

    if(keyboard[39]){ //right arrow key
        cube.rotation.z -= Math.PI * 0.01;
    }

    if(keyboard[87]){ //W key
        cube.position.x += Math.cos(cube.rotation.z) * player.speed;
        cube.position.y += Math.sin(cube.rotation.z) * player.speed;
        
        camera.position.x += Math.cos(cube.rotation.z) * player.speed;
        camera.position.y += Math.sin(cube.rotation.z) * player.speed;
    }

    if(keyboard[83]){ //S key
        cube.position.x -= Math.cos(cube.rotation.z) * player.speed;
        cube.position.y -= Math.sin(cube.rotation.z) * player.speed;

        camera.position.x -= Math.cos(cube.rotation.z) * player.speed;
        camera.position.y -= Math.sin(cube.rotation.z) * player.speed;
    }

    controls.target.copy(cube.position);
}


function render(){
    if(flag){
        flag.rotation.x += 0.03;
        flag.rotation.y += 0.03;
        flag.rotation.z += 0.03;
    }
    
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    renderer2.render(scene2, camera2);

    player_movement();

    //Coin animation
    for(let i = 0; i < coins.length; i++){
        coins[i].rotation.y += 0.03;
    }
}

function keyDown(e) {
    keyboard[e.keyCode] = true;
}

function keyUp(e) {
    keyboard[e.keyCode] = false;
}

window.addEventListener('keydown', keyDown)
window.addEventListener('keyup', keyUp)

render();