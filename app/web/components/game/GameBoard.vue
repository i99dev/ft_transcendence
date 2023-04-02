<template>
  <div class="canvas-wrapper bg-slate-700 flex justify-center">
    <canvas ref="canvas" class="bg-slate-800 border-2 rounded-xl shadow-2xl shadow-slate-900"></canvas>
  </div>
</template>

<script lang="ts" setup>
import {io, Socket}  from 'socket.io-client'

// refs
let canvas = ref({} as HTMLCanvasElement)
let ctx = ref({} as CanvasRenderingContext2D)
let objsSizes = ref({} as gameObjects)
let gameSetup = ref({} as SetupDto)
let gameData = ref({} as gameStatusDto)
let grabbed = ref(false as boolean)
let offsetY = ref(0 as number)
const socket = ref({} as Socket);

// game settings
const sensitivity = 3; // for mouse movements or touch movements
const canvasRatio = 1.5; // board width / board height

// Defines
const emit = defineEmits(['ReadyGame', 'GameOver'])
defineExpose({ setup, destroy, giveUp })

function setup() : void {

  // setup socket connection and events
  socketSetup()
  socketEvents()

  // setup canvas values
  setUpCanvas()

  // handle window events
  windowEvents()

  // draw the game board
  draw()
}

function destroy() : void {
  if (socket.value.connected) 
    socket.value.disconnect()
}

function giveUp() : void {
  socket.value.emit('Give-Up', gameSetup.value.game.players[gameSetup.value.player - 1])
}

const socketSetup = () : void => {
  socket.value = socket.value = io('http://localhost/games', {
      withCredentials: true,
      extraHeaders: {
          Authorization: `Bearer ${useCookie('access_token').value}`,
      },
      path: '/socket.io',
  })
}

const socketEvents = () : void => {
  socket.value.on('Game-Setup', (payload : SetupDto) => {
    emit('ReadyGame')
    gameSetup.value = payload
    storeGameData(gameSetup.value.game)
    draw()
  })

  socket.value.on('Game-Data', (payload) => {
    storeGameData(payload)
    draw()
  })

  socket.value.on('Game-Over', (payload) => {
    if (payload.username == gameSetup.value.game.players[gameSetup.value.player])
      emit('GameOver', 'you won')
    else
      emit('GameOver', 'you won')
  })
}

const windowEvents = () : void => {
  // Handle Window resize
  window.addEventListener('resize', () => redraw());
  
  // Handle Keyboard events
  document.addEventListener('keydown', handleKeyDown)
  // Handle Mouse and Touch events
  window.addEventListener("mousedown", holdPaddle);
  window.addEventListener("mousemove", movePaddle);
  window.addEventListener("mouseup", leavePaddle);
  window.addEventListener("touchstart", holdPaddle);
  window.addEventListener("touchmove", movePaddle);
  window.addEventListener("touchend", leavePaddle);
}

const holdPaddle = (e: Event) : void => {
  const curOffsetY = getCurrentHoldPosY(e as MouseEvent & TouchEvent) 
  offsetY.value = curOffsetY;
  grabbed.value = true;
}

const movePaddle = (e: Event) : void => {
  const curOffsetY = getCurrentHoldPosY(e as MouseEvent & TouchEvent)
  if (grabbed.value) {
    if (curOffsetY < offsetY.value - sensitivity) {
      socket.value.emit('move', 'up')
      offsetY.value = curOffsetY;
    }
    else if (curOffsetY > offsetY.value + sensitivity) {
      socket.value.emit('move', 'down')
      offsetY.value = curOffsetY;
    }
  }
}

const getCurrentHoldPosY = (e : MouseEvent & TouchEvent) : number => {
  return e.changedTouches ? e.changedTouches[0].clientY : e.offsetY
}

const leavePaddle = (e: any) : void => {
  if (grabbed.value) {
    offsetY.value = 0;
    grabbed.value = false;
  }
}

const initialize = () : void => {
  objsSizes.value = {
    score: {
      size: canvas.value.width / 20,
    }
  }
}

const storeGameData = (payload : gameStatusDto) : void => {
  gameData.value = payload
  storePlayersData(gameData.value.players)
  storeBallData(gameData.value.ball)
}

const storePlayersData = (players : PlayerDto[]) : void => {
  for (let i = 0; i < players.length; i++) {
    players[i].paddle.width *= canvas.value.width;
    players[i].paddle.height *= canvas.value.height;
    players[i].y = players[i].y * canvas.value.height - players[i].paddle.height / 2;
  }
}

const storeBallData = (ball : BallDto) : void => {
  ball.x *= canvas.value.width
  ball.y *= canvas.value.height
  ball.radius *= canvas.value.height
}

const setUpCanvas = () : void => {
  const canvasWrapper = document.querySelector('.canvas-wrapper') as HTMLCanvasElement
  const parent = canvasWrapper.parentNode as HTMLElement

  if (parent && parent.offsetHeight * canvasRatio >= parent.offsetWidth)
    canvasWrapper.style.height = (canvasWrapper.offsetWidth / canvasRatio / parent.offsetHeight * 100) + '%'
  else
    canvasWrapper.style.height = '90%'

  canvas.value.height = canvasWrapper.offsetHeight;
  canvas.value.width = canvas.value.height * canvasRatio;

  ctx.value = canvas.value.getContext('2d') as CanvasRenderingContext2D

  initialize()
};

onUnmounted(() : void => {
  destroy()
})

const redraw = () : void => {
  // Draw it all again.
  setUpCanvas();
  draw();
}

const draw = () : void => {
  if (isObjEmpty(gameData.value)) return

  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
  drawPlayer(gameData.value.players)
  drawPlayersInfo()
  drawScore()
  drawBall()

  // temporary decision for winner
  checkWinner()
}

const isObjEmpty = (obj : any) : boolean => {
    return Object.values(obj).length === 0 && obj.constructor === Object;
}

// temporay function for winner. need to be removed
const checkWinner = () : void => {
  let gameFinished = false
  for (let p = 0; p < gameData.value.players.length; p++)
    if (gameData.value.players[p].score == 11)
        gameFinished = true

  if (gameFinished) {
    for (let p = 0; p < gameData.value.players.length; p++) {
      if (p == gameSetup.value.player - 1) {
        if (gameData.value.players[p].score == 11)
          emit('GameOver', 'you won')
        else
          emit('GameOver', 'you Lost')
      }
    }
  }
}

const handleKeyDown = (event : KeyboardEvent) : void => {
  switch (event.key) {
    case 'ArrowUp':
      socket.value.emit('move', 'up')
      break
    case 'ArrowDown':
      socket.value.emit('move', 'down')
      break
  }
}

const drawBall = () : void => {
  ctx.value.beginPath()
  ctx.value.arc(gameData.value.ball.x, gameData.value.ball.y, gameData.value.ball.radius, 0, Math.PI * 2)
  ctx.value.fillStyle = 'white'
  ctx.value.fill()
  ctx.value.closePath()
}

const drawPlayer = (players : PlayerDto[]) : void => {
  for (let i = 0; i < players.length; i++) {
    const p = players[i];
    const posy = p.y * canvas.value.height - p.paddle.height / 2
    const posx = i == 0 ? 0 : canvas.value.width - p.paddle.width
    ctx.value.fillStyle = 'white'
    ctx.value.fillRect(posx, p.y, p.paddle.width, p.paddle.height)
  }
}

const drawScore = () : void => {
  // draw player 1 score
  let text = `${gameData.value.players[0].score}\t\t`
  let {w: w1, h: h1} = textSetup(text, objsSizes.value.score.size)
  drawText(text, objsSizes.value.score.size, -w1/2, -canvas.value.height / 2 + objsSizes.value.score.size * 2)
  
  // draw player 2 score
  text = `\t\t${gameData.value.players[1].score}`
  let {w : w2, h: h2} = textSetup(text, objsSizes.value.score.size)
  drawText(text, objsSizes.value.score.size, w2/2, -canvas.value.height / 2 + objsSizes.value.score.size * 2)

  // draw : in the middle
  drawText(`:`, objsSizes.value.score.size, 0, -canvas.value.height / 2 + objsSizes.value.score.size * 2)
}

const drawPlayersInfo = () : void => {
  // draw player 1 username
  drawText(`${gameData.value.players[0].username}`, objsSizes.value.score.size, -canvas.value.width / 4, -canvas.value.height / 2 + objsSizes.value.score.size * 2)
  
  // draw player 2 username
  drawText(`${gameData.value.players[1].username}`, objsSizes.value.score.size, canvas.value.width / 4, -canvas.value.height / 2 + objsSizes.value.score.size * 2)
}

const drawText = (text : string, size : number, posx = 0, posy = 0) : void => {
  const {w, h} = textSetup(text, size)
  clearText(text, size, w, h, posx, posy)
  ctx.value.fillText(text, canvas.value.width / 2 - w/2 + posx, canvas.value.height / 2 - h/2 + posy)
}

const clearText = (text : string, size : number, w : number, h : number, posx = 0, posy = 0) => {
}

const textSetup = (text : string, size : number) : {w: number, h: number} => {
  ctx.value.font = `${size}px Arial`
  const w = ctx.value.measureText(text).width
  const h = ctx.value.measureText(text).fontBoundingBoxAscent + ctx.value.measureText(text).fontBoundingBoxDescent
  return {w, h}
}

</script>

<style scoped>

.canvas-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90%;
  margin: 0;
  padding: 0;
}

</style>