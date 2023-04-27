<template>
    <canvas ref="canvasRef" style="width: 100%; height: 100%;"> HEHEHE</canvas>
</template>
  

<script lang="ts" setup>
import { io, Socket } from 'socket.io-client'
import { ref, defineEmits, defineExpose, onUnmounted } from 'vue'
import * as THREE from 'three'
import { GLTFLoader, OrbitControls } from 'three-stdlib'

let canvasRef = ref<HTMLCanvasElement>()

let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer
let controls: OrbitControls
let gameGroup: THREE.Group, paddle: THREE.Mesh, paddle2: THREE.Mesh, sphere: THREE.Mesh

// refs
let objsSizes = ref({} as gameObjects)
let gameSetup = ref({} as SetupDto)
let gameData = ref({} as gameStatusDto)
let grabbed = ref(false as boolean)
let offsetY = ref(0 as number)
const nuxtApp = useNuxtApp()
const socket = ref(nuxtApp.socket as Socket)

const keys: { [key: string]: boolean } = {
    ArrowUp: false,
    ArrowDown: false
};

// game settings
const sensitivity = 3 // for mouse movements or touch movements
const canvasRatio = 1.5 // board width / board height

const frameWidth = 30
const frameHeight = 15
const playGroundWidth = 28
const playGroundHeight = 15

// Defines
const emit = defineEmits(['ReadyGame', 'GameOver'])
defineExpose({ resetSocket, setup, destroy, giveUp })

function resetSocket(): void {
    socket.value.off()
}

function setup(mode: GameSelectDto): void {
    // setup socket connection and events
    resetSocket();
    socketSetup(mode)
    socketEvents()
    
    // handle window events
    windowEvents()
    // Define EVENTS HERE
    
    // draw the game board
    draw()
}

function destroy(): void {
    // if (socket.value.connected) socket.value.disconnect()
}

function giveUp(): void {
    socket.value.emit('Give-Up', gameSetup.value.game.players[gameSetup.value.player])
}

const socketSetup = (mode: GameSelectDto): void => {
	socket.value.emit('Join-game', mode)
}

const socketEvents = (): void => {
	socket.value.on('Game-Setup', (payload: SetupDto) => {
        emit('ReadyGame')
        gameSetup.value = payload
        storeGameData(gameSetup.value.game)
        init()
        animate()
    })

    socket.value.on('Game-Data', payload => {
        storeGameData(payload)
        draw()
    })

    socket.value.on('Game-Over', payload => {
        if (payload.winner.username == gameSetup.value.game.players[gameSetup.value.player].username)
            emit('GameOver', 'you won')
        else emit('GameOver', 'you lost')
    })
}

const windowEvents = (): void => {

    // Handle Keyboard events
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp);

}

const storeGameData = (payload: gameStatusDto): void => {
    gameData.value = payload
    storePlayersData(gameData.value.players)
    storeBallData(gameData.value.ball)
}

const storePlayersData = (players: PlayerDto[]): void => {
    for (let i = 0; i < players.length; i++) {
        players[i].paddle.width *= playGroundWidth
        players[i].paddle.height *= playGroundHeight
        players[i].paddle.y = - (players[i].paddle.y * playGroundHeight - playGroundHeight/2)
    }
}

const storeBallData = (ball: BallDto): void => {
    ball.x = - (ball.x * playGroundWidth - playGroundWidth/2)
    ball.y = - (ball.y * playGroundHeight - playGroundHeight/2)
    ball.radius *= playGroundHeight
}


onUnmounted((): void => {
    destroy()
})

const draw = (): void => {
    if (isObjEmpty(gameData.value)) return

    updatePaddleDirection();
    updatePlayer(gameData.value.players)
    updateBall(gameData.value.ball)
}

const updatePlayer = (players: PlayerDto[]): void => {
    for (let i = 0; i < players.length; i++) {
        if (i == 1) {
            paddle.position.y = players[i].paddle.y
            //change paddle height
        } else {
            paddle2.position.y = players[i].paddle.y
        }
    }
}

const updateBall = (ball: BallDto): void => {
    sphere.position.x = ball.x
    sphere.position.y = ball.y
    // change sphere color
}

const isObjEmpty = (obj: any): boolean => {
    return Object.values(obj).length === 0 && obj.constructor === Object
}

const activatePowerUp = (key: string): void => {
    if (key == '1') {
        socket.value.emit('Power-Up', 'Hiken')
    } else if (key == '2') {
        socket.value.emit('Power-Up', 'Baika no Jutsu')
    } else if (key == '3') {
        socket.value.emit('Power-Up', 'Shinigami')
    } else if (key == '4') {
        socket.value.emit('Power-Up', 'Shunshin no Jutsu')
    }
}

const handleKeyDown = (event: KeyboardEvent): void => {

    if (keys.hasOwnProperty(event.key)) {
        event.preventDefault();
    }

        if (event.key == 'ArrowUp' || event.key == 'ArrowDown')
        keys[event.key] = true;
        else if (event.key == '1' || event.key == '2' || event.key == '3' || event.key == '4') {
            activatePowerUp(event.key)
    }
};

const handleKeyUp = (event: KeyboardEvent): void => {
    if (keys.hasOwnProperty(event.key)) {
        event.preventDefault();
        keys[event.key] = false;
}
};

const updatePaddleDirection = (): void => {
    if (keys.ArrowUp) {
        socket.value.emit('move', 'up');
    } else if (keys.ArrowDown) {
        socket.value.emit('move', 'down');
    }
};


///////////////////////////////////////////////////////////////

function init() {
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

    renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value })
    renderer.setSize(window.innerWidth, window.innerHeight)
    
    gameGroup = new THREE.Group()

    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.1
    controls.screenSpacePanning = false

    // Set up the paddle dimensions
    const paddleWidth = gameSetup.value.game.players[0].paddle.width;
    const paddleHeight = gameSetup.value.game.players[0].paddle.height;;
    const paddle2Width = gameSetup.value.game.players[1].paddle.width;
    const paddle2Height = gameSetup.value.game.players[1].paddle.height;;
    const paddleDepth = 0.5;
    const paddle1Y = gameSetup.value.game.players[0].paddle.y;
    const paddle2Y = gameSetup.value.game.players[1].paddle.y;

    const paddlePosition = new THREE.Vector3(-playGroundWidth/2, paddle1Y, 0);
    const paddle2Position = new THREE.Vector3(playGroundWidth/2, paddle2Y, 0);
    paddle = createPaddle(paddleWidth, paddleHeight, paddleDepth, paddlePosition, 0x006600, 0x00ff00, 0.1);
    paddle2 = createPaddle(paddle2Width, paddle2Height, paddleDepth, paddle2Position, 0x006600, 0x00ff00, 0.1);
    
    addPointLightToObject(paddle, new THREE.Vector3(0, 0, 1.5), 0x00ff00, 6, 3);
    addPointLightToObject(paddle2, new THREE.Vector3(0, 0, 1.5), 0x00ff00, 6, 3);
    gameGroup.add(paddle);
    gameGroup.add(paddle2);


    const sphereRadius = 0.5; // you can change this to the desired radius
    const spherePosition = new THREE.Vector3(0, 0, 0); // you can change this to the desired position
    sphere = createSphere(sphereRadius, spherePosition, 0xffffff, 0xffffff, 0.5);
    addPointLightToObject(sphere, new THREE.Vector3(0, 0, 1.5), 0xffffff, 3, 6);

    gameGroup.add(sphere);


    // Game Arena
    const frameThickness = 0.1
    const frameDepth = 0.5
    const frameGeometry = createFrameGeometry(frameWidth, frameHeight, frameThickness, frameDepth)
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide })
    const frame = new THREE.Mesh(frameGeometry, frameMaterial)
    addPointLight(0,7, 0, 0x6810eb, 1, 10)
    addPointLight(0,-7, 0, 0x6810eb, 1, 10)
    addPointLight(-14, 0, 0, 0x6810eb, 1, 10)
    addPointLight(14, 0, 0, 0x6810eb, 1, 10)
    frame.position.set(0, 0, 0)
    gameGroup.add(frame)

    scene.add(gameGroup)
    gameGroup.rotateX(-0.3)

    camera.position.z = 0
    camera.position.set(0, 0, 17)
}

function addPointLight(x: number, y: number, z: number, color: number = 0xffffff, intensity: number = 1, distance: number = 0) {
    const pointLight = new THREE.PointLight(color, intensity, distance);
    pointLight.position.set(x, y, z + 1.5);
    scene.add(pointLight);
    // const sphereSize = 1;
    // const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
    // scene.add(pointLightHelper);
}

function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
}

function createPaddle(width: number, height: number, depth: number, position: THREE.Vector3, color: number, emissive: number, emissiveIntensity: number): THREE.Mesh {
    const paddleGeometry = new THREE.BoxGeometry(width, height, depth);
    const paddleMaterial = new THREE.MeshStandardMaterial({
        color: color,
        emissive: emissive,
        emissiveIntensity: emissiveIntensity
    });
    const paddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
    paddle.position.copy(position);
    return paddle;
}

function addPointLightToObject(object: THREE.Object3D, relativePosition: THREE.Vector3, color: number = 0xffffff, intensity: number = 1, distance: number = 0) {
    const pointLight = new THREE.PointLight(color, intensity, distance);
    pointLight.position.copy(relativePosition);
    object.add(pointLight);

    // const sphereSize = 1;
    // const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
    // object.add(pointLightHelper);
}

function createFrameGeometry(width: number, height: number, thickness: number, depth: number) {
    const halfWidth = width / 2
    const halfHeight = height / 2

    const shape = new THREE.Shape()

    // Outer rectangle
    shape.moveTo(-halfWidth, halfHeight)
    shape.lineTo(halfWidth, halfHeight)
    shape.lineTo(halfWidth, -halfHeight)
    shape.lineTo(-halfWidth, -halfHeight)
    shape.lineTo(-halfWidth, halfHeight)

    // Inner rectangle (hole)
    const hole = new THREE.Path()
    hole.moveTo(-halfWidth + thickness, halfHeight - thickness)
    hole.lineTo(halfWidth - thickness, halfHeight - thickness)
    hole.lineTo(halfWidth - thickness, -halfHeight + thickness)
    hole.lineTo(-halfWidth + thickness, -halfHeight + thickness)
    hole.lineTo(-halfWidth + thickness, halfHeight - thickness)
    shape.holes.push(hole)

    const extrudeSettings = {
        depth: depth,
        bevelEnabled: false,
    }

    return new THREE.ExtrudeGeometry(shape, extrudeSettings)
}

function createSphere(radius: number, position: THREE.Vector3, color: number, emissive: number, emissiveIntensity: number): THREE.Mesh {
    const sphereGeometry = new THREE.SphereGeometry(radius);
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color: color,
        emissive: emissive,
        emissiveIntensity: emissiveIntensity
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.copy(position);

    return sphere;
}

</script>
  
<style>
.three-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>
  