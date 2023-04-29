import * as THREE from 'three'
import { GLTFLoader, OrbitControls, TTFLoader, FontLoader, TextGeometry } from 'three-stdlib'
import { watch } from 'vue'
import * as GAME from '~/constants/'

export function useGameRenderer() {
    const gameSetup = useState<SetupDto>('gameSetup')
    const gameData = useState<gameStatusDto>('gameData')

    let scene: THREE.Scene, camera: THREE.OrthographicCamera, renderer: THREE.WebGLRenderer
    let controls: OrbitControls
    let gameGroup: THREE.Group, paddle: THREE.Mesh, paddle2: THREE.Mesh, sphere: THREE.Mesh
    let originalPaddleHeight: number, originalPaddle2Height: number


    const onWindowResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const aspectRatio = width / height;

        const cameraWidth = 50;
        const cameraHeight = cameraWidth / aspectRatio;

        camera.left = -cameraWidth / 2;
        camera.right = cameraWidth / 2;
        camera.top = cameraHeight / 2;
        camera.bottom = -cameraHeight / 2;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    };

    const initScene = (canvasRef: Ref<HTMLCanvasElement>) => {
        scene = new THREE.Scene()
        scene.background = new THREE.Color(0x000000)

        renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value })
        renderer.setSize(window.innerWidth, window.innerHeight)

        const aspectRatio = window.innerWidth / window.innerHeight;
        const width = 50;
        const height = width / aspectRatio;

        camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0.1, 2000);
        camera.position.set(0, 0, 15);
    }

    const createGameObjects = async () => {
        gameGroup = new THREE.Group()

        /* ------------------------------- */

        const paddleWidth = gameSetup.value.game.players[0].paddle.width;
        const paddleHeight = gameSetup.value.game.players[0].paddle.height;;
        const paddle2Width = gameSetup.value.game.players[1].paddle.width;
        const paddle2Height = gameSetup.value.game.players[1].paddle.height;;
        const paddleDepth = 0.4;
        const paddle1Y = gameSetup.value.game.players[0].paddle.y;
        const paddle2Y = gameSetup.value.game.players[1].paddle.y;

        const paddlePosition = new THREE.Vector3(-GAME.PG_WIDTH / 2, paddle1Y, 0);
        const paddle2Position = new THREE.Vector3(GAME.PG_WIDTH / 2, paddle2Y, 0);
        paddle = createPaddle(paddleWidth, paddleHeight, paddleDepth, paddlePosition, 0x006600, 0x6810eb, 0.1);
        paddle2 = createPaddle(paddle2Width, paddle2Height, paddleDepth, paddle2Position, 0x006600, 0x6810eb, 0.1);

        addPointLightToObject(paddle, new THREE.Vector3(0, 0, 1.5), 0x00ff00, 6, 3);
        addPointLightToObject(paddle2, new THREE.Vector3(0, 0, 1.5), 0x00ff00, 6, 3);
        gameGroup.add(paddle);
        gameGroup.add(paddle2);

        /* ------------------------------- */

        const sphereRadius = 0.5;
        const spherePosition = new THREE.Vector3(0, 0, 0.5);
        sphere = createSphere(sphereRadius, spherePosition, 0xffffff, 0xffffff, 0.5);
        addPointLightToObject(sphere, new THREE.Vector3(0, 0, 1.5), 0xffffff, 4, 6);
        gameGroup.add(sphere);

        /* ------------------------------- */

        const frameGeometry = createFrameGeometry(GAME.FRAME_WIDTH, GAME.FRAME_HEIGHT, GAME.FRAME_THICKNESS, GAME.FRAME_DEPTH)
        const frameMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide })
        const frame = new THREE.Mesh(frameGeometry, frameMaterial)
        addPointLight(0, 8, 0, 0x6004d9, 3, 10)
        addPointLight(0, -8, 0, 0x6004d9, 3, 10)
        // addPointLight(-14, 0, 0, 0x00ff00, 1, 7)
        // addPointLight(14, 0, 0, 0x00ff00, 1, 7)
        frame.position.set(0, 0, 0)
        gameGroup.add(frame)

        /* ------------------------------- */

        const planeWidth = GAME.FRAME_WIDTH + 1.8
        const planeHeight = GAME.FRAME_HEIGHT + 0.85
        const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
        const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.set(0, 0, -1);
        gameGroup.add(plane);

    }

    const enableOrbitControls = () => {
        controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.1
        controls.screenSpacePanning = false
    }

    const init_game = async (canvasRef: Ref<HTMLCanvasElement>) => {
        initScene(canvasRef)
        enableOrbitControls()
        await createGameObjects()
        addEventListener('resize', onWindowResize)
        originalPaddleHeight = gameSetup.value.game.players[0].paddle.height
        originalPaddle2Height = gameSetup.value.game.players[1].paddle.height
        const loader = new GLTFLoader();

        loader.load(
            '/scene.gltf',
            function (gltf) {
                gltf.scene.rotateX(Math.PI / 2);
                gltf.scene.scale.set(1.5, 1.5, 1.5);
                addPointLightToObject(gltf.scene, new THREE.Vector3(0, 1, 0), 0xffffff, 2, 3);

                scene.add(gltf.scene);
            },
            undefined,
            function (error) {
                console.error(error);
            }
        );

        scene.add(gameGroup)
        scene.background = new THREE.Color(0x202020)
        animate()
    }

    const rescaleGameData = (game: gameStatusDto) => {
        rescalePlayers(game.players)
        rescaleBall(game.ball)
    }

    const rescalePlayers = (players: PlayerDto[]): void => {
        for (let i = 0; i < players.length; i++) {
            players[i].paddle.width *= GAME.PG_WIDTH
            players[i].paddle.height *= GAME.PG_HEIGHT
            players[i].paddle.y = - (players[i].paddle.y * GAME.PG_HEIGHT - GAME.PG_HEIGHT / 2)
        }
    }

    const rescaleBall = (ball: BallDto): void => {
        ball.x = (ball.x * GAME.PG_WIDTH - GAME.PG_WIDTH / 2)
        ball.y = - (ball.y * GAME.PG_HEIGHT - GAME.PG_HEIGHT / 2)
        ball.radius *= GAME.PG_HEIGHT
    }

    const updatePlayer = (players: PlayerDto[]): void => {
        for (let i = 0; i < players.length; i++) {
            if (i == 0) {
                paddle.position.y = players[i].paddle.y
                let scaleFactor = 1;
                if (players[i].paddle.height != originalPaddleHeight) {
                    scaleFactor = players[i].paddle.height / originalPaddleHeight
                }
                paddle.scale.y = scaleFactor

                updatePaddleColor(paddle, players[i].paddle.color)
            } else {
                paddle2.position.y = players[i].paddle.y
                let scaleFactor = 1;
                if (players[i].paddle.height != originalPaddle2Height) {
                    scaleFactor = players[i].paddle.height / originalPaddle2Height
                }
                paddle2.scale.y = scaleFactor

                updatePaddleColor(paddle2, players[i].paddle.color)
            }
        }
    }

    const updatePaddleColor = (paddle: THREE.Mesh, color: string): void => {
        let newColor = 0x006600;
        let newEmissive = 0x6810eb;
        let newLightColor = 0x00ff00;

        if (color == 'orange') {
            newColor = 0xffa500;
            newEmissive = 0xffa500;
            newLightColor = 0xffa500;

        } else if (color == 'cyan') {
            newColor = 0x00ffff;
            newEmissive = 0x00ffff;
            newLightColor = 0x00ffff;
        }

        if (paddle.material instanceof THREE.MeshStandardMaterial) {
            paddle.material.color.set(newColor);
            paddle.material.emissive.set(newEmissive);
        }

        paddle.traverse((child) => {
            if (child instanceof THREE.PointLight) {
                child.color.set(newLightColor);
            }
        });
    }

    const updateBallColor = (ball: THREE.Mesh, color: string): void => {

        if (ball.material instanceof THREE.MeshStandardMaterial) {
            if (color == 'transparent') {
                ball.material.opacity = 0;
                console.log("CHANGED TO TRANSPARENTTT")
            }
            else {
                ball.material.opacity = 0.9;
            }
        }
    }

    const updateBall = (ball: BallDto): void => {
        sphere.position.x = ball.x
        sphere.position.y = ball.y
        updateBallColor(sphere, ball.color)
    }

    function addPointLight(x: number, y: number, z: number, color: number = 0xffffff, intensity: number = 1, distance: number = 0) {
        const pointLight = new THREE.PointLight(color, intensity, distance);
        pointLight.position.set(x, y, z + 1.5);
        scene.add(pointLight);
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

    function addPointLightToObject(object: THREE.Object3D, relativePosition: THREE.Vector3, color: number, intensity: number = 1, distance: number = 0) {
        const pointLight = new THREE.PointLight(color, intensity, distance);
        pointLight.position.copy(relativePosition);
        object.add(pointLight);
    }

    function createFrameGeometry(width: number, height: number, thickness: number, depth: number) {
        const halfWidth = width / 2
        const halfHeight = height / 2

        const shape = new THREE.Shape()

        shape.moveTo(-halfWidth, halfHeight)
        shape.lineTo(halfWidth, halfHeight)
        shape.lineTo(halfWidth, -halfHeight)
        shape.lineTo(-halfWidth, -halfHeight)
        shape.lineTo(-halfWidth, halfHeight)

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
        const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
        const sphereMaterial = new THREE.MeshStandardMaterial({
            color: color,
            emissive: emissive,
            emissiveIntensity: emissiveIntensity,
            transparent: true,
            opacity: 0.9
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.copy(position);

        return sphere;
    }

    return {
        init_game,
        updatePlayer,
        updateBall,
        rescaleGameData
    }
}