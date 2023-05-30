import * as THREE from 'three'
import { GLTFLoader, OrbitControls, TTFLoader, FontLoader, TextGeometry } from 'three-stdlib'
import { watch } from 'vue'
import * as GAME from '~/constants/'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { Tween, Easing } from '@tweenjs/tween.js'

export function useGameRenderer() {
    const gameSetup = useState<SetupDto>('gameSetup')
    const gameData = useState<gameStatusDto>('gameData')
    const isMobile = useState<boolean>('isMobile')

    let scene: THREE.Scene, camera: THREE.OrthographicCamera, renderer: THREE.WebGLRenderer
    let controls: OrbitControls
    let gameGroup: THREE.Group, paddle: THREE.Mesh, paddle2: THREE.Mesh, sphere: THREE.Mesh
    let originalPaddleHeight: number, originalPaddle2Height: number
    let wallsLayer = new THREE.Layers()
    wallsLayer.set(1)
    let bloomPass: UnrealBloomPass
    let composer: EffectComposer
    let rotateTween: Tween<{ y:number }> | null = null
    let zoomTween: Tween<{ zoom: number }> | null = null
    const reset = () => {
        if (gameGroup) {
            gameGroup.children.forEach(child => {
                if (child instanceof THREE.Mesh) {
                    child.geometry.dispose()
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(material => material.dispose())
                        } else {
                            child.material.dispose()
                        }
                    }
                }
            })
            gameGroup.remove(...gameGroup.children)
        }

        if (scene) {
            scene.remove(gameGroup)
        }
    }
    const onWindowResize = () => {
        const width = window.innerWidth
        const height = window.innerHeight
        const aspectRatio = width / height

        const cameraWidth = 45
        const cameraHeight = cameraWidth / aspectRatio

        camera.left = -cameraWidth / 2
        camera.right = cameraWidth / 2
        camera.top = cameraHeight / 2
        camera.bottom = -cameraHeight / 2
        camera.updateProjectionMatrix()

        renderer.setSize(width, height)
        composer.setSize(width, height)
        // bloomPass.setSize(width, height);
    }

    const resetCamera = () => {
        camera.position.set(0, 0, 15)
        camera.lookAt(0, 0, 0)
    }

    const initPostProcessing = () => {
        composer = new EffectComposer(renderer)

        const renderPass = new RenderPass(scene, camera)
        composer.addPass(renderPass)

        bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.7,
            0.05,
            0.1,
        )

        composer.addPass(bloomPass)
    }

    const initScene = (canvasRef: Ref<HTMLCanvasElement>) => {
        scene = new THREE.Scene()
        scene.background = new THREE.Color(0x000000)

        renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value })
        renderer.setSize(window.innerWidth, window.innerHeight)

        const aspectRatio = window.innerWidth / window.innerHeight
        const width = 45
        const height = width / aspectRatio

        camera = new THREE.OrthographicCamera(
            -width / 2,
            width / 2,
            height / 2,
            -height / 2,
            0.1,
            2000,
        )
        camera.position.set(0, 0, 15)
        camera.layers.enable(1)
        camera.zoom = 0.01
        camera.updateProjectionMatrix()
    }

    const createGameObjects = async () => {
        gameGroup = new THREE.Group()

        /* ------------------------------- */

        const paddleWidth = gameSetup.value?.game.players[0].paddle.width
        const paddleHeight = gameSetup.value?.game.players[0].paddle.height
        const paddle2Width = gameSetup.value?.game.players[1].paddle.width
        const paddle2Height = gameSetup.value?.game.players[1].paddle.height
        const paddleDepth = 0.4
        const paddle1Y = gameSetup.value?.game.players[0].paddle.y
        const paddle2Y = gameSetup.value?.game.players[1].paddle.y

        const paddlePosition = new THREE.Vector3(-GAME.PG_WIDTH / 2, paddle1Y, 0)
        const paddle2Position = new THREE.Vector3(GAME.PG_WIDTH / 2, paddle2Y, 0)
        paddle = createPaddle(
            paddleWidth,
            paddleHeight,
            paddleDepth,
            paddlePosition,
            0x59cbe8,
            0x7edfe8,
            1,
        )
        paddle2 = createPaddle(
            paddle2Width,
            paddle2Height,
            paddleDepth,
            paddle2Position,
            0x59cbe8,
            0x7edfe8,
            0.5,
        )

        addPointLightToObject(paddle, new THREE.Vector3(0, 0, 1), 0x7edfe8, 4, 2)
        addPointLightToObject(paddle2, new THREE.Vector3(0, 0, 1), 0x7edfe8, 4, 2)
        paddle.layers.enable(1)
        paddle2.layers.enable(1)
        gameGroup.add(paddle)
        gameGroup.add(paddle2)

        //Ball
        /* ------------------------------- */

        const sphereRadius = gameSetup.value?.game.ball.radius
        const spherePosition = new THREE.Vector3(0, 0, 0.5)
        sphere = createSphere(sphereRadius, spherePosition, 0xffffff, 0xffffff, 0.5)
        // addPointLightToObject(sphere, new THREE.Vector3(0, 0, 1.5), 0xffffff, 4, 4);
        gameGroup.add(sphere)
        gameGroup.rotation.x = Math.PI

        /* ------------------------------- */

        const frameGeometry = createFrameGeometry(
            GAME.FRAME_WIDTH,
            GAME.FRAME_HEIGHT,
            GAME.FRAME_THICKNESS,
            GAME.FRAME_DEPTH,
        )
        const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
        })
        const frame = new THREE.Mesh(frameGeometry, frameMaterial)
        // frame.layers.enable(1)
        addPointLight(0, 11, 0, 0xe93cac, 5, 10)
        addPointLight(0, -11, 0, 0xe93cac, 5, 10)
        addPointLight(2, 11, 0, 0xe93cac, 5, 10)
        addPointLight(2, -11, 0, 0xe93cac, 5, 10)
        addPointLight(-2, 11, 0, 0xe93cac, 5, 10)
        addPointLight(-2, -11, 0, 0xe93cac, 5, 10)
        // addPointLight(5, 11, 0, 0xE93CAC, 5, 10)
        // addPointLight(5, -11, 0, 0xE93CAC, 5, 10)
        // addPointLight(0, 11, 0, 0xE93CAC, 5, 10)
        // addPointLight(0, -11, 0, 0xE93CAC, 5, 10)
        // addPointLight(-15, 11, 0, 0xE93CAC, 5, 10)
        // addPointLight(-15, -11, 0, 0xE93CAC, 5, 10)
        // addPointLight(-10, 11, 0, 0xE93CAC, 5, 10)
        // addPointLight(-10, -11, 0, 0xE93CAC, 5, 10)
        // addPointLight(-5, 11, 0, 0xE93CAC, 5, 10)
        // addPointLight(-5, -11, 0, 0xE93CAC, 5, 10)

        // addPointLight(-14, 0, 0, 0x00ff00, 1, 7)
        // addPointLight(14, 0, 0, 0x00ff00, 1, 7)
        frame.position.set(0, 0, 0)
        gameGroup.add(frame)

        /* ------------------------------- */

        const planeWidth = GAME.FRAME_WIDTH + 1.8
        const planeHeight = GAME.FRAME_HEIGHT + 0.85
        const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight)
        const planeMaterial = new THREE.MeshBasicMaterial({
            color: 0,
            side: THREE.DoubleSide,
        })
        const plane = new THREE.Mesh(planeGeometry, planeMaterial)
        plane.position.set(0, 0, -1)
        gameGroup.add(plane)

        const halfHeight = GAME.FRAME_HEIGHT / 2
        const lineStart = new THREE.Vector3(0, -halfHeight, 0)
        const lineEnd = new THREE.Vector3(0, halfHeight, 0)
        const lineColor = 0xffffff

        const dashedLine = createDashedLine(lineStart, lineEnd, lineColor)
        gameGroup.add(dashedLine)
    }

    function createDashedLine(start: THREE.Vector3, end: THREE.Vector3, color: number) {
        const geometry = new THREE.BufferGeometry().setFromPoints([start, end])

        const material = new THREE.LineDashedMaterial({
            color: color,
            linewidth: 1,
            scale: 1,
            dashSize: 0.5,
            gapSize: 0.5,
        })

        const line = new THREE.Line(geometry, material)

        line.computeLineDistances()

        return line
    }

    const enableOrbitControls = () => {
        controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.1
        controls.screenSpacePanning = false
        controls.maxZoom = 1.5
        controls.minZoom = 0.5
        controls.enablePan = false
    }

    const loadLogo = () => {
        const loader = new GLTFLoader()
        loader.load(
            '/scenes/scene.gltf',
            function (gltf) {
                gltf.scene.rotateX(Math.PI / 2)
                gltf.scene.scale.set(1.5, 1.5, 1.5)
                addPointLightToObject(gltf.scene, new THREE.Vector3(0, 0.2, 0), 0xffffff, 3, 6)

                gltf.scene.traverse(child => {
                    if (child instanceof THREE.Mesh) {
                        if (child.material instanceof THREE.MeshStandardMaterial) {
                            child.material.roughness = 1
                            child.material.metalness = 1
                        }
                    }
                })

                scene.add(gltf.scene)
                gameGroup.add(gltf.scene)
            },
            undefined,
            function (error) {
                console.error(error)
            },
        )
    }

    const init_game = async (canvasRef: Ref<HTMLCanvasElement>) => {
        initScene(canvasRef)
        initPostProcessing()
        if (!isMobile.value) enableOrbitControls()
        await createGameObjects()
        addEventListener('resize', onWindowResize)
        originalPaddleHeight = gameSetup.value?.game.players[0].paddle.height
        originalPaddle2Height = gameSetup.value?.game.players[1].paddle.height

        loadLogo()

        scene.add(gameGroup)
        scene.background = new THREE.Color(0x17213c)
        animate()
    }

    const animate = () => {
        requestAnimationFrame(animate)
        zoomTween?.update()
        rotateTween?.update()
        if (!isMobile.value) controls.update()
        composer.render()
        // renderer.render(scene, camera)
    }

    const zoomToArena = () => {
        if (!camera) return
        rotateTween = new Tween(gameGroup.rotation)
            .to({ x: 0 }, 2500)
            .onUpdate(() => { camera.updateProjectionMatrix() })
            .start();
        zoomTween = new Tween(camera)
            .to({ zoom: 1 }, 2500)
            .onUpdate(() => { camera.updateProjectionMatrix() })
            .start();

    }

    const rescaleGameData = (game: gameStatusDto) => {
        rescalePlayers(game.players)
        rescaleBall(game.ball)
    }

    const rescalePlayers = (players: PlayerDto[]): void => {
        for (let i = 0; i < players.length; i++) {
            players[i].paddle.width *= GAME.PG_WIDTH
            players[i].paddle.height *= GAME.PG_HEIGHT
            players[i].paddle.y = -(players[i].paddle.y * GAME.PG_HEIGHT - GAME.PG_HEIGHT / 2)
        }
    }

    const rescaleBall = (ball: BallDto): void => {
        ball.x = ball.x * GAME.PG_WIDTH - GAME.PG_WIDTH / 2
        ball.y = -(ball.y * GAME.PG_HEIGHT - GAME.PG_HEIGHT / 2)
        ball.radius *= GAME.PG_HEIGHT
    }

    const updatePlayer = (players: PlayerDto[]): void => {
        if (!paddle || !paddle2)
            return
        for (let i = 0; i < players.length; i++) {
            if (i == 0) {
                paddle.position.y = players[i].paddle.y
                let scaleFactor = 1
                if (players[i].paddle.height != originalPaddleHeight) {
                    scaleFactor = players[i].paddle.height / originalPaddleHeight
                }
                paddle.scale.y = scaleFactor

                updatePaddleColor(paddle, players[i].paddle.color, i)
            } else {
                paddle2.position.y = players[i].paddle.y
                let scaleFactor = 1
                if (players[i].paddle.height != originalPaddle2Height) {
                    scaleFactor = players[i].paddle.height / originalPaddle2Height
                }
                paddle2.scale.y = scaleFactor

                updatePaddleColor(paddle2, players[i].paddle.color, i)
            }
        }
    }

    const updatePaddleColor = (paddle: THREE.Mesh, color: string, player: number): void => {
        let newColor: number
        let newLightColor: number

        if (player == 0) {
            newColor = 0x59cbe8
            newLightColor = 0x59cbe8
        } else {
            newColor = 0x59cbe8
            newLightColor = 0x59cbe8
        }

        if (color == 'orange') {
            newColor = 0xffa500
            newLightColor = 0xffa500
        } else if (color == 'cyan') {
            newColor = 0xc0c0c0
            newLightColor = 0xc0c0c0
        }

        if (paddle.material instanceof THREE.MeshBasicMaterial) {
            paddle.material.color.set(newColor)
        }

        paddle.traverse(child => {
            if (child instanceof THREE.PointLight) {
                child.color.set(newLightColor)
            }
        })
    }

    const updateBallColor = (ball: THREE.Mesh, color: string): void => {
        if (ball.material instanceof THREE.MeshStandardMaterial) {
            if (color == 'transparent') {
                ball.material.opacity = 0
            } else {
                ball.material.opacity = 0.9
            }
        }
    }

    const updateBall = (ball: BallDto): void => {
        if (!sphere || !ball)
            return
        sphere.position.x = ball.x
        sphere.position.y = ball.y
        updateBallColor(sphere, ball.color)
    }

    function addPointLight(
        x: number,
        y: number,
        z: number,
        color: number = 0xffffff,
        intensity: number = 1,
        distance: number = 0,
    ) {
        const pointLight = new THREE.PointLight(color, intensity, distance)
        pointLight.position.set(x, y, z + 1.5)
        pointLight.layers.enable(1)
        scene.add(pointLight)
    }

    function createPaddle(
        width: number,
        height: number,
        depth: number,
        position: THREE.Vector3,
        color: number,
        emissive: number,
        emissiveIntensity: number,
    ): THREE.Mesh {
        const paddleGeometry = new THREE.BoxGeometry(width, height, depth)
        const paddleMaterial = new THREE.MeshBasicMaterial({
            color: color,
        })
        const paddle = new THREE.Mesh(paddleGeometry, paddleMaterial)
        paddle.position.copy(position)
        return paddle
    }

    function addPointLightToObject(
        object: THREE.Object3D,
        relativePosition: THREE.Vector3,
        color: number,
        intensity: number = 1,
        distance: number = 0,
    ) {
        const pointLight = new THREE.PointLight(color, intensity, distance)
        pointLight.position.copy(relativePosition)
        object.add(pointLight)
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

    function createSphere(
        radius: number,
        position: THREE.Vector3,
        color: number,
        emissive: number,
        emissiveIntensity: number,
    ): THREE.Mesh {
        const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32)
        const sphereMaterial = new THREE.MeshStandardMaterial({
            color: color,
            emissive: emissive,
            emissiveIntensity: emissiveIntensity,
            transparent: true,
            opacity: 0.9,
        })
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
        sphere.position.copy(position)

        // Add PointLight to the sphere
        const pointLight = new THREE.PointLight(emissive, 1.5, 10)
        pointLight.position.set(0, 0, 1.5)
        pointLight.color.set(0xa3f1ff)
        pointLight.layers.enable(1)
        sphere.add(pointLight)

        return sphere
    }

    return {
        init_game,
        updatePlayer,
        updateBall,
        rescaleGameData,
        resetCamera,
        zoomToArena,
        reset,
    }
}
