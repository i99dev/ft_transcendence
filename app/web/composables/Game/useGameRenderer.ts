import * as THREE from 'three'
import { GLTFLoader, OrbitControls } from 'three-stdlib'
import { watch } from 'vue'
import * as GAME from '~/constants/'

export function useGameRenderer() {
    const gameSetup = useState<SetupDto>('gameSetup')
    const gameData = useState<gameStatusDto>('gameData')

    let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer
    let controls: OrbitControls
    let gameGroup: THREE.Group, paddle: THREE.Mesh, paddle2: THREE.Mesh, sphere: THREE.Mesh

    const initScene = (canvasRef: Ref<HTMLCanvasElement>) => {
        scene = new THREE.Scene()
        scene.background = new THREE.Color(0x000000)

        renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value })
        renderer.setSize(window.innerWidth, window.innerHeight)

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.set(0, 0, 15)
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
        sphere = createSphere(sphereRadius, spherePosition, 0xffffff, 0xffffff, 0);
        addPointLightToObject(sphere, new THREE.Vector3(0, 0, 1.5), 0xffffff, 3, 4);
        gameGroup.add(sphere);

        /* ------------------------------- */



        const frameGeometry = createFrameGeometry(GAME.FRAME_WIDTH, GAME.FRAME_HEIGHT, GAME.FRAME_THICKNESS, GAME.FRAME_DEPTH)
        const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.DoubleSide })
        const frame = new THREE.Mesh(frameGeometry, frameMaterial)
        addPointLight(0, 7, 0, 0x00ff00, 1, 7)
        addPointLight(0, -7, 0, 0x00ff00, 1, 7)
        // addPointLight(-14, 0, 0, 0x00ff00, 1, 7)
        // addPointLight(14, 0, 0, 0x00ff00, 1, 7)
        frame.position.set(0, 0, 0)
        gameGroup.add(frame)

        /* ------------------------------- */

        const planeWidth = GAME.FRAME_WIDTH - GAME.FRAME_THICKNESS * 2;
        const planeHeight = GAME.FRAME_HEIGHT - GAME.FRAME_THICKNESS * 2;
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

    const addLighting = () => {
        // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        // scene.add(ambientLight);

        // const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        // pointLight.position.set(0, 0, 10);
        // scene.add(pointLight);

        // const spotLight = new THREE.SpotLight(0xffffff, 0.5);
        // spotLight.position.set(-10, 10, 10);
        // spotLight.target.position.set(0, 0, 0);
        // scene.add(spotLight);
        // scene.add(spotLight.target);
    }

    const init_game = async (canvasRef: Ref<HTMLCanvasElement>) => {
        initScene(canvasRef)
        enableOrbitControls()
        addLighting()

        await createGameObjects()
        const loader = new GLTFLoader();

        loader.load(
            '/scene.gltf',
            function (gltf) {
                gltf.scene.rotateX(Math.PI / 2);
                gltf.scene.scale.set(1.5, 1.5, 1.5);
                addPointLightToObject(gltf.scene, new THREE.Vector3(0, 1, 0), 0xffffff, 2, 4);
                
                scene.add(gltf.scene);
            },
            undefined,
            function (error) {
                console.error(error);
            }
        );
            
        scene.add(gameGroup)
        animate()
    }

    const rescaleGameData = (game: gameStatusDto) => {
        rescalePlayers(game.players)
        rescaleBall(game.ball)
    }

    const loadTexture = async (path: string): Promise<THREE.Texture> => {
        const loader = new THREE.TextureLoader();
        return new Promise((resolve, reject) => {
            loader.load(
                path,
                (texture) => resolve(texture),
                undefined,
                (error) => reject(error)
            );
        });
    };

    const rescalePlayers = (players: PlayerDto[]): void => {
        for (let i = 0; i < players.length; i++) {
            players[i].paddle.width *= GAME.PG_WIDTH
            players[i].paddle.height *= GAME.PG_HEIGHT
            players[i].paddle.y = - (players[i].paddle.y * GAME.PG_HEIGHT - GAME.PG_HEIGHT / 2)
        }
    }

    const rescaleBall = (ball: BallDto): void => {
        ball.x = - (ball.x * GAME.PG_WIDTH - GAME.PG_WIDTH / 2)
        ball.y = - (ball.y * GAME.PG_HEIGHT - GAME.PG_HEIGHT / 2)
        ball.radius *= GAME.PG_HEIGHT
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

    return {
        init_game,
        updatePlayer,
        updateBall,
        rescaleGameData
    }
}