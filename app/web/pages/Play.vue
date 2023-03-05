<template>
  <div class="m-10 flex justify-center" >
    <canvas ref="game" width="800" height="600" class="border rounded-lg shadow-lg bg-slate-100 block"></canvas>
  </div>
  <div class="m-10 grid grid-cols-2 content-center">
      <button @click="moveUp(player1)" class="border rounded-md p-2 m-2 bg-slate-200 w-96 place-self-end ">Up</button>
      <button @click="moveUp(player2)" class="border rounded-md p-2 m-2 bg-slate-200 w-96 place-self-start">Up</button>
      <button @click="moveDown(player1)" class="border rounded-md p-2 m-2 bg-slate-200 w-96 place-self-end">Down</button>
      <button @click="moveDown(player2)" class="border rounded-md p-2 m-2 bg-slate-200 w-96 place-self-start">Down</button>
  </div>
</template>

<script setup> 
import {io}  from 'socket.io-client'

definePageMeta({
  middleware: ["pages"]
})

let game = ref({})
let gameSettings = ref({
  canvas: {
    width: 1200,
    height: 600
  },
  context: null,
  players: 2,
  ball: {
    radius: 10,
    position: {
      x: 0,
      y: 0
    },
    speed: 10,
    direction: {
      x: 1,
      y: 1
    }
  }
});
let socket = ref(null) // socket.io
let context = ref({})
let player1 = ref({
  id: 1,
  name: 'Player 1',
  score: 0,
  position: {
    x: 0,
    y: 0
  },
  bar: {
    width: 10,
    height: 150
  },
  speed: 10,
})
let player2 = ref({
  id: 2,
  name: 'Player 2',
  score: 0,
  position: {
    x: 0,
    y: 0
  },
  bar: {
    width: 10,
    height: 150
  },
  speed: 10,
})

onMounted(() => {

  // Socket.io
  socket.value = io("http://192.168.192.2:8000/games")
  socket.value.on('game_settings', (gameSettingsData) => {
    gameSettings = gameSettingsData
  })
  socket.value.on('move', (payload) => {
    payload = JSON.parse(payload)
    if (payload.player._value.id === player1.value.id)
      player1.value = payload.player._value
    else if (payload.player._value.id === player2.value.id)
      player2.value = payload.player._value
    if (payload.dir === 'up')
      moveUp(payload.player._value)
    else if (payload.dir === 'down')  
      moveDown(payload.player._value)
  })

  // initial player1 position
  player1.value.position = {
    x: 0,
    y: game.value.getContext('2d').canvas.height / 2 - player1.value.bar.height / 2
  }
  
  // initial player2 position
  player2.value.position = {
    x: game.value.getContext('2d').canvas.width - player2.value.bar.width,
    y: game.value.getContext('2d').canvas.height / 2 - player2.value.bar.height / 2
  }
  
  // Draw players bars and a line in the middle
  drawBar(player1.value)
  drawBar(player2.value)
  drawMiddleLine()

  // Listen for arrow key events
  window.addEventListener('keydown', handleKeyDown)
})

const drawBar = (player) => {
  context.value = game.value.getContext('2d')
  context.value.clearRect(player.position.x, 0, player.bar.width, context.value.canvas.height)
  context.value.fillRect(player.position.x, player.position.y, player.bar.width, player.bar.height)
}

const drawMiddleLine = () => {
  context.value.fillRect(context.value.canvas.width / 2 - 1, 0, 2, context.value.canvas.height)
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
  if (player.position.y >= player.speed)
    player.position.y -= player.speed
  else if (player.position.y > 0)
    player.position.y = 0
  drawBar(player)
}

const moveDown = (player) => {
  if (player.position.y + player.bar.height < game.value.height - player.speed)
    player.position.y += player.speed
  else if (player.position.y + player.bar.height < game.value.height)
    player.position.y = game.value.height - player.bar.height
  drawBar(player)
}

</script>
