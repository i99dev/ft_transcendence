<template>
  <div class="canvas-wrapper bg-slate-700 flex justify-center">
    <canvas ref="canvas" class="bg-slate-800 border-2 rounded-xl shadow-2xl shadow-slate-900"></canvas>
  </div>
</template>

<script setup>
  import {io}  from 'socket.io-client'

  let canvas = ref(undefined)
  let ctx = ref(undefined)
  let objsSizes = ref(undefined)
  let gameSetup = ref(undefined)
  let gameData = ref(undefined)
  let grabbed = ref(false)
  let offsetY = ref(0)
  const sensitivity = 3;
  const socket = ref();
  const emit = defineEmits(['ReadyGame', 'GameOver'])
  defineExpose({ socketSetup, gameUnmounted, giveUp })

  function socketSetup() {
    socket.value = socket.value = io('http://localhost/games', {
        withCredentials: true,
        extraHeaders: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
        path: '/socket.io',
    })

    socket.value.on('Game-Setup', (payload) => {
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
      // if (payload.username == gameSetup.value.game.players[gameSetup.value.player])
      //   emit('GameOver', "winner")
      // else
      //   emit('GameOver', "loser")
    })


    setUpCanvas()
    initialize()
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', () => redraw());

    // Handle Mouse and Touch events
    window.addEventListener("mousedown", holdPaddle);
    window.addEventListener("mousemove", movePaddle);
    window.addEventListener("mouseup", leavePaddle);
    window.addEventListener("touchstart", holdPaddle);
    window.addEventListener("touchmove", movePaddle);
    window.addEventListener("touchend", leavePaddle);

    
    draw()
  }

  const holdPaddle = (e) => {
    const curOffsetY = getCurrentHoldPosY(e) 
    offsetY.value = curOffsetY;
    grabbed.value = true;
  }

  const movePaddle = (e) => {
    const curOffsetY = getCurrentHoldPosY(e)
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

  const getCurrentHoldPosY = (e) => {
    return e.changedTouches ? e.changedTouches[0].clientY : e.offsetY
  }

  const leavePaddle = (e) => {
    if (grabbed.value) {
      offsetY.value = 0;
      grabbed.value = false;
    }
  }
  // const holdPaddle = (e) => {
  //   console.log(e.offsetY)
  //   offsetY.value = e.offsetY;
  //   grabbed.value = true;
  // }

  // const movePaddle = (e) => {
  //   if (grabbed.value) {
  //     if (e.offsetY < offsetY.value - sensitivity) {
  //       socket.value.emit('move', 'up')
  //       offsetY.value = e.offsetY;
  //     }
  //     else if (e.offsetY > offsetY.value + sensitivity) {
  //       socket.value.emit('move', 'down')
  //       offsetY.value = e.offsetY;
  //     }
  //   }
  // }

  // const leavePaddle = (e) => {
  //   if (grabbed.value) {
  //     offsetY.value = 0;
  //     grabbed.value = false;
  //   }
  // }

  

  const initialize = () => {
    objsSizes.value = {
      scoreSize: canvas.value.width / 20,
    }
  }

  const storeGameData = (payload) => {
    gameData.value = payload
    storePlayersData(gameData.value.players)
    storeBallData(gameData.value.ball)
  }

  const storePlayersData = (players) => {
    for (let i = 0; i < players.length; i++) {
      players[i].paddle.width *= canvas.value.width;
      players[i].paddle.height *= canvas.value.height;
      players[i].y = players[i].y * canvas.value.height - players[i].paddle.height / 2;
    }
  }

  const storeBallData = (ball) => {
    ball.x *= canvas.value.width
    ball.y *= canvas.value.height
    ball.radius *= canvas.value.height
  }

  const setUpCanvas = () => {

    const canvasWrapper = document.querySelector('.canvas-wrapper')
    if (canvasWrapper.parentNode.offsetHeight * 1.5 >= canvasWrapper.parentNode.offsetWidth)
      canvasWrapper.style.height = (canvasWrapper.offsetWidth / 1.5 / canvasWrapper.parentNode.offsetHeight * 100) + '%'

    canvas.value.height = canvasWrapper.offsetHeight;
    canvas.value.width = canvas.value.height * 1.5;

    ctx.value = canvas.value.getContext('2d')
  };

  onUnmounted(() => {
    gameUnmounted()
  })

  function gameUnmounted() {
    if (socket.value.connected) 
      socket.value.disconnect()
  }

  const redraw = () => {
    // Draw it all again.
    setUpCanvas();
    draw();
  }

  const draw = () => {
    if (!gameData.value) return

    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
    drawPlayer(gameData.value.players)
    drawPlayersInfo()
    drawScore()
    drawBall()

    // temporary decision for winner
    checkWinner()
  }

  const checkWinner = () => {
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

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowUp':
        socket.value.emit('move', 'up')
        break
      case 'ArrowDown':
        socket.value.emit('move', 'down')
        break
    }
  }

  function giveUp() {
    socket.value.emit('Give-Up', gameSetup.value.game.players[gameSetup.value.player - 1])
  }

  const drawBall = () => {
    ctx.value.beginPath()
    ctx.value.arc(gameData.value.ball.x, gameData.value.ball.y, gameData.value.ball.radius, 0, Math.PI * 2)
    ctx.value.fillStyle = 'white'
    ctx.value.fill()
    ctx.value.closePath()
  }

  const drawPlayer = (players) => {
    for (let i = 0; i < players.length; i++) {
      const p = players[i];
      const posy = p.y * canvas.value.height - p.paddle.height / 2
      const posx = i == 0 ? 0 : canvas.value.width - p.paddle.width
      ctx.value.fillStyle = 'white'
      ctx.value.fillRect(posx, p.y, p.paddle.width, p.paddle.height)
    }
  }

  const drawScore = () => {
    // draw player 1 score
    let text = `${gameData.value.players[0].score}\t\t`
    let {w: w1, h: h1} = textSetup(text, objsSizes.value.scoreSize)
    drawText(text, objsSizes.value.scoreSize, -w1/2, -canvas.value.height / 2 + objsSizes.value.scoreSize * 2)
    
    // draw player 2 score
    text = `\t\t${gameData.value.players[1].score}`
    let {w : w2, h: h2} = textSetup(text, objsSizes.value.scoreSize)
    drawText(text, objsSizes.value.scoreSize, w2/2, -canvas.value.height / 2 + objsSizes.value.scoreSize * 2)

    // draw : in the middle
    drawText(`:`, objsSizes.value.scoreSize, 0, -canvas.value.height / 2 + objsSizes.value.scoreSize * 2)
  }

  const drawPlayersInfo = () => {
    // draw player 1 username
    drawText(`${gameData.value.players[0].username}`, objsSizes.value.scoreSize, -canvas.value.width / 4, -canvas.value.height / 2 + objsSizes.value.scoreSize * 2)
    
    // draw player 2 username
    drawText(`${gameData.value.players[1].username}`, objsSizes.value.scoreSize, canvas.value.width / 4, -canvas.value.height / 2 + objsSizes.value.scoreSize * 2)
  }

  const drawText = (text, size, posx = 0, posy = 0) => {
    const {w, h} = textSetup(text, size)
    clearText(text, size, w, h, posx, posy)
    ctx.value.fillText(text, canvas.value.width / 2 - w/2 + posx, canvas.value.height / 2 - h/2 + posy)
  }

  const clearText = (text, size, w, h, posx = 0, posy = 0) => {
  }

  const textSetup = (text, size) => {
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
  height: 90%;
  margin: 0;
  padding: 0;
}

</style>