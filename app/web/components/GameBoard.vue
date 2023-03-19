<template>
  <div class="canvas-wrapper bg-slate-700 flex justify-center">
    <canvas ref="canvas" class="bg-slate-800 border-2 rounded-xl shadow-2xl shadow-slate-900"></canvas>
  </div>
</template>

<script setup>
  let gameStatus = ref('start') // ['start', 'paused', 'play', 'end']
  let canvas = ref({})
  let ctx = ref({})
  let ball = ref({})
  let player1 = ref({})
  let player2 = ref({})
  let winner = ref({})
  let objsSizes = ref({})


  const nuxtApp = useNuxtApp();
  const socket = nuxtApp.socket;

  const initialize = () => {
    ctx.value = canvas.value.getContext('2d')

    ball.value = {
      x: canvas.value.width / 2,
      y: canvas.value.height / 2,
      speedX: canvas.value.height / 150,
      speedY: canvas.value.height / 150,
      radius: canvas.value.height / 100
    }

    player1.value = {
      login: 'bnaji',
      x: 0,
      y: 1 / 2,
      width: canvas.value.width / 50,
      height: canvas.value.height / 5,
      score: 0,
      speed: canvas.value.height / 32
    }

    player2.value = {
      login: 'isaad',
      x: canvas.value.width - canvas.value.width / 50,
      y: 1 / 2,
      width: canvas.value.width / 50,
      height: canvas.value.height / 5,
      score: 0,
      speed: canvas.value.height / 32
    }

    objsSizes.value = {
      scoreSize: canvas.value.width / 25,
      gameStatusSize: canvas.value.width / 20,
      gameStatusDisSize: canvas.value.width / 30,
    }
  }
  const setUpCanvas = () => {

    const canvasWrapper = document.querySelector('.canvas-wrapper')
    if (canvasWrapper.parentNode.offsetHeight * 1.5 >= canvasWrapper.parentNode.offsetWidth)
      canvasWrapper.style.height = (canvasWrapper.offsetWidth / 1.5 / canvasWrapper.parentNode.offsetHeight * 100) + '%'

    canvas.value.height = canvasWrapper.offsetHeight;
    canvas.value.width = canvas.value.height * 1.5;

    initialize()
  };

  onMounted(() => {
    socket.value.on('gameStatus', (gameStatusData) => {
      if (gameStatus.value === 'paused' || gameStatus.value === 'start' || gameStatus.value === 'end') {
        if (gameStatus.value == 'end') {
          player1.value.score = 0
          player2.value.score = 0
        }
        gameStatus.value = gameStatusData
        draw()
      }
      else if (gameStatus.value === 'play')
        gameStatus.value = gameStatusData
    })
    socket.value.on('move', (payload) => {
      payload = JSON.parse(payload)
      if (payload.player._value.login == player1.value.login) {
        player1.value.y = payload.player._value.y
        payload.player._value = player1.value
      }
      else if (payload.player._value.login == player2.value.login) {
        player2.value.y = payload.player._value.y
        payload.player._value = player2.value
      } 
      if (payload.dir === 'up')
        moveUp(payload.player._value)
      else if (payload.dir === 'down')
        moveDown(payload.player._value)
    })

    setUpCanvas()
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keypress', switchGameState)
    window.addEventListener('resize', () => redraw());

    draw()
  })

  const redraw = () => {
    // Clear the canvas.
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);

    // Draw it all again.
    setUpCanvas();
    draw();
  }

  const draw = () => {
    drawElements()

    // update ball.value position
    if (gameStatus.value === 'play') {
      ball.value.x += ball.value.speedX
      ball.value.y += ball.value.speedY
    }

    // check for ball collision with upper and lower walls
    if (ball.value.y + ball.value.speedY > canvas.value.height - ball.value.radius || ball.value.y + ball.value.speedY < ball.value.radius) {
      ball.value.speedY = -ball.value.speedY
    }

    // check for ball collision with players
    if (checkBallCollision()) {
      ball.value.speedX = -ball.value.speedX
    }

    // check for player1.value or player2.value scored
    if (ball.value.x + ball.value.speedX > canvas.value.width - ball.value.radius) {
      player1.value.score++
      ball.value.x = canvas.value.width / 2
      ball.value.y = canvas.value.height / 2
      ball.value.speedX = -ball.value.speedX
      ball.value.speedY = -ball.value.speedY
      if (player1.value.score === 11) {
        gameStatus.value = 'end'
        winner.value = player1.value
      }
      drawScore()
      
    } else if (ball.value.x + ball.value.speedX < ball.value.radius) {
      player2.value.score++
      ball.value.x = canvas.value.width / 2
      ball.value.y = canvas.value.height / 2
      ball.value.speedX = -ball.value.speedX
      ball.value.speedY = -ball.value.speedY
      if (player2.value.score === 11) {
        gameStatus.value = 'end'
        winner.value = player2.value
      }
      drawScore()
    }


    if (gameStatus.value === 'play')
      requestAnimationFrame(draw)
    else if (gameStatus.value === 'start')
      drawText('Start', objsSizes.value.gameStatusSize)
    else if (gameStatus.value === 'paused')
      drawText('Paused', objsSizes.value.gameStatusSize)
    else if (gameStatus.value === 'end')
      drawWinner()

  }

  const drawElements = () => {
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
    drawPlayer(player1.value)
    drawPlayer(player2.value)
    drawScore()
    drawBall()
  }

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'w':
        socket.value.emit('move', (JSON.stringify({player: player1, dir: 'up'})))
        break
      case 's':
        socket.value.emit('move', (JSON.stringify({player: player1, dir: 'down'})))
        break
      case 'i':
        socket.value.emit('move', (JSON.stringify({player: player2, dir: 'up'})))
        break
      case 'k':
        socket.value.emit('move', (JSON.stringify({player: player2, dir: 'down'})))
        break
    }
  }

  const moveUp = (player) => {
    let posy = player.y * canvas.value.height - player.height / 2

    if (posy >= player.speed)
      posy -= player.speed
    else if (posy > 0)
      posy = 0

    player.y = (posy + player.height / 2) / canvas.value.height
  }

  const moveDown = (player) => {
    let posy = player.y * canvas.value.height - player.height / 2

    if (posy + player.height < canvas.value.height - player.speed)
      posy += player.speed
    else if (posy + player.height < canvas.value.height)
      posy = canvas.value.height - player.height

    player.y = (posy + player.height / 2) / canvas.value.height
  }

  const drawBall = () => {
    ctx.value.beginPath()
    ctx.value.arc(ball.value.x, ball.value.y, ball.value.radius, 0, Math.PI * 2)
    ctx.value.fillStyle = 'white'
    ctx.value.fill()
    ctx.value.closePath()
  }

  const checkBallCollision = () => {
    const dif = ball.value.radius * Math.cos(Math.PI / 4)
    let posx = ball.value.x + ball.value.speedX
    let posy = ball.value.y + ball.value.speedY
    if (
      // player1
      checkPlayerCollision(player1.value, posx - ball.value.radius, posy) || // left
      checkPlayerCollision(player1.value, posx - dif, posy - dif) || // left up
      checkPlayerCollision(player1.value, posx - dif, posy + dif) || // left down
      checkPlayerCollision(player1.value, posx, posy + dif) || // down
      checkPlayerCollision(player1.value, posx, posy - dif) || // up

      // player2
      checkPlayerCollision(player2.value, posx + ball.value.radius, posy) || // right
      checkPlayerCollision(player2.value, posx + dif, posy - dif) || // right up
      checkPlayerCollision(player2.value, posx + dif, posy + dif) || // right down
      checkPlayerCollision(player2.value, posx, posy + dif) || // down
      checkPlayerCollision(player2.value, posx, posy - dif) //up
    )
      return true
    return false
  }

  const checkPlayerCollision = (player, x, y) => {
    const posy = player.y * canvas.value.height - player.height / 2
    if (x > player.x && x < player.x + player.width &&
      y > posy && y < posy + player.height)
      return true
    return false
  }

  const drawPlayer = (p) => {
    const posy = p.y * canvas.value.height - p.height / 2
    ctx.value.clearRect(p.x, 0, p.width, canvas.value.height)
    ctx.value.fillStyle = 'white'
    ctx.value.fillRect(p.x, posy, p.width, p.height)
  }

  const drawScore = () => {
    drawText(`${player1.value.score} : ${player2.value.score}`, objsSizes.value.scoreSize, 0, -canvas.value.height / 2 + objsSizes.value.scoreSize * 2)
  }

  const drawText = (text, size, posx = 0, posy = 0) => {
    const {w, h} = textSetup(text, size)
    clearText(text, size, w, h, posx, posy)
    ctx.value.fillText(text, canvas.value.width / 2 - w/2 + posx, canvas.value.height / 2 - h/2 + posy)
  }

  const clearText = (text, size, w, h, posx = 0, posy = 0) => {
    ctx.value.clearRect(canvas.value.width / 2 - w/2 + posx, canvas.value.height / 2 - size - h * 3/10 + posy, w, size)
  }

  const textSetup = (text, size) => {
    ctx.value.font = `${size}px Arial`
    const w = ctx.value.measureText(text).width
    const h = ctx.value.measureText(text).fontBoundingBoxAscent + ctx.value.measureText(text).fontBoundingBoxDescent
    return {w, h}
  }

  const drawWinner = () => {
    if (player1.value.score === 11)
      drawText(`Player 1 wins`, objsSizes.value.gameStatusSize)
    else if (player2.value.score === 11)
      drawText(`Player 2 wins`, objsSizes.value.gameStatusSize)
    drawText(`Press 'Enter' to restart`, 20, 0, objsSizes.value.gameStatusDisSize)
  }

  const switchGameState = (event) => {
    if (event.key === ' ') {
      if (gameStatus.value === 'paused' || gameStatus.value === 'start')
        socket.value.emit('gameStatus', 'play')
      else if (gameStatus.value === 'play')
        socket.value.emit('gameStatus', 'paused')
    }
    else if (event.key === 'Enter')
      if (gameStatus.value === 'end')
        socket.value.emit('gameStatus', 'start')
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