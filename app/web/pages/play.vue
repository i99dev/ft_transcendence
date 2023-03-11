<template>
  <div class="m-10 flex justify-center">
    <canvas ref="canvas" width="1000" height="700" class="bg-slate-800"></canvas>
  </div>
</template>

<script setup>

  let gameState = ref('start') // ['start', 'paused', 'play', 'end']
  let canvas = ref({})
  let ctx = ref({})
  let ball = ref({})
  let player1 = ref({})
  let player2 = ref({})
  let winner = ref({})

  const nuxtApp = useNuxtApp();
  const socket = nuxtApp.socket;

  const initialize = () => {
    ctx.value = canvas.value.getContext('2d')

    ball.value = {
      x: canvas.value.width / 2,
      y: canvas.value.height / 2,
      speedX: 3,
      speedY: 3,
      radius: 10
    }

    player1.value = {
      login: 'bnaji',
      x: 0,
      y: canvas.value.height / 2 - 50,
      width: 10,
      height: 100,
      score: 0,
      speed: 15
    }

    player2.value = {
      login: 'isaad',
      x: canvas.value.width - 10,
      y: canvas.value.height / 2 - 50,
      width: 10,
      height: 100,
      score: 0,
      speed: 10
    }
  }

  onMounted(() => {
    socket.value.on('game_settings', (gameSettingsData) => {
      gameSettings = gameSettingsData
    })
    socket.value.on('move', (payload) => {
      payload = JSON.parse(payload)
      if (payload.player._value.login == player1.value.login)
        player1.value = payload.player._value
      else if (payload.player._value.login == player2.value.login)
        player2.value = payload.player._value
      if (payload.dir === 'up')
        moveUp(payload.player._value)
      else if (payload.dir === 'down')
        moveDown(payload.player._value)
    })

    initialize()

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keypress', switchGameState)

    drawElements()
    draw()
  })

  const draw = () => {
    drawElements()

    // update ball.value position
    if (gameState.value === 'play') {
      ball.value.x += ball.value.speedX
      ball.value.y += ball.value.speedY
    }

    // check for wall collisions
    if (ball.value.y + ball.value.speedY > canvas.value.height - ball.value.radius || ball.value.y + ball.value.speedY < ball.value.radius) {
      ball.value.speedY = -ball.value.speedY
    }

    // check for player1.value collision
    if (ball.value.x + ball.value.speedX < player1.value.x + player1.value.width &&
      ball.value.y > player1.value.y &&
      ball.value.y < player1.value.y + player1.value.height) {
      ball.value.speedX = -ball.value.speedX
    }

    // check for player2.value collision
    if (ball.value.x + ball.value.speedX > player2.value.x &&
      ball.value.y > player2.value.y &&
      ball.value.y < player2.value.y + player2.value.height) {
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
        gameState.value = 'end'
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
        gameState.value = 'end'
        winner.value = player2.value
      }
      drawScore()
    }


    if (gameState.value === 'play')
      requestAnimationFrame(draw)
    else if (gameState.value === 'start')
      drawText('Start', 50)
    else if (gameState.value === 'paused')
      drawText('Paused', 50)
    else if (gameState.value === 'end')
      drawWinner()
  }

  const drawElements = () => {
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
    drawPlayer(player1.value)
    drawPlayer(player2.value)
    drawScore()
    drawBall()
  }

  const movePlayer1 = (evt) => {
    if (gameState.value !== 'play') return
    if (evt.key === 'w' && player1.value.y > 0  ) {
      player1.value.y -= player1.value.speed
    } else if (evt.key === 's' && player1.value.y < canvas.value.height - player1.value.height) {
      player1.value.y += player1.value.speed
    }
  }

  const movePlayer2 = (evt) => {
    if (gameState.value !== 'play') return
    if (evt.key === 'i' && player2.value.y > 0) {
      player2.value.y -= player2.value.speed
    } else if (evt.key === 'k' && player2.value.y < canvas.value.height - player2.value.height) {
      player2.value.y += player2.value.speed
    }
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
    if (player.y >= player.speed)
      player.y -= player.speed
    else if (player.y > 0)
      player.y = 0
  }
  const moveDown = (player) => {
    if (player.y + player.height < canvas.value.height - player.speed)
      player.y += player.speed
    else if (player.y + player.height < canvas.value.height)
      player.y = canvas.value.height - player.height
  }

  const drawBall = () => {
    ctx.value.beginPath()
    ctx.value.arc(ball.value.x, ball.value.y, ball.value.radius, 0, Math.PI * 2)
    ctx.value.fillStyle = 'white'
    ctx.value.fill()
    ctx.value.closePath()
  }

  const drawPlayer = (p) => {
    ctx.value.clearRect(p.x, 0, p.width, canvas.value.height)
    ctx.value.fillStyle = 'white'
    ctx.value.fillRect(p.x, p.y, p.width, p.height)
  }

  const drawScore = () => {
    if (gameState.value === 'end')
      ctx.value.clearRect(canvas.value.width / 2 - 30, 0, 100, 100)
    ctx.value.font = '30px Arial'
    ctx.value.fillStyle = 'white'
    ctx.value.fillText(`${player1.value.score} : ${player2.value.score}`, canvas.value.width / 2 - 30, 30)
  }

  const drawText = (text, size, posx = 0, posy = 0) => {
    const {w, h} = textSetup(text, size)
    clearText(text, size, w, h, posx, posy)
    console.log(w)
    console.log(h)
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
      drawText(`Player 1 wins`, 100)
    else if (player2.value.score === 11)
      drawText(`Player 2 wins`, 100)
    drawText(`Press Enter to restart`, 20, 0, 100)
  }

  const switchGameState = (evt) => {
    if (evt.key === ' ') {
      if (gameState.value === 'paused' || gameState.value === 'start') {
        gameState.value = 'play'
        draw()
      } else if (gameState.value === 'play') {
        gameState.value = 'paused'
      }
    }
    else if (evt.key === 'Enter') {
      if (gameState.value === 'end') {
        gameState.value = 'start'
        player1.value.score = 0
        player2.value.score = 0
        draw()
      }
    }
  }
</script>

