<template>
    <div>
        <div class="min-h-screen text-center justify-center overflow-hidden py-20">
            <div class="flex flex-col items-center">
                <div class="w-1 h-2 centered animate-bounce">
                    <h1
                        class="text-primary mt-20 w-fit text-9xl whitespace-nowrap font-[CyberGlitch]"
                    >
                        {{ useRuntimeConfig().GAME_NAME }}
                    </h1>
                </div>
            </div>
            <h1 class="text-2xl font-bold mb-20 mt-20 text-white">The Ping Pong Game</h1>
            <!-- <div class="text-white">
                <div class="mb-8">
                    <h2 class="text-xl font-bold mb-2">Game Modes</h2>
                    <p>There are two game modes available:</p>
                    <ul class="pl-6 list-none">
                        <li><strong>Custom:</strong> Activates power-ups during the game.</li>
                        <li><strong>Classic:</strong> Play the game without any power-ups.</li>
                    </ul>
                </div>
                <div class="mb-8">
                    <h2 class="text-xl font-bold mb-2">Players</h2>
                    <p>In both game modes, you have two options for players:</p>
                    <ul class="pl-6 list-none">
                        <li><strong>Online Multiplayer:</strong> Play against someone online.</li>
                        <li>
                            <strong>Single Player (with Bot):</strong> Play alone against a
                            computer-controlled opponent.
                        </li>
                    </ul>
                </div>
                <div>
                    <h2 class="text-xl font-bold mb-2">Controls</h2>
                    <p>Use the following controls to play the game:</p>
                    <ul class="list-none pl-6">
                        <img src="../assets/keys.png" class="w-30 h-40 mx-auto" alt="Keyboard" />
                        <li>
                            <strong>Arrow Buttons:</strong> Move the player paddle left and right.
                        </li>
                        <li><strong>1 and 2 Buttons:</strong> Activate power-ups.</li>
                    </ul>
                </div>
                <div>
                    <h2 class="text-xl font-bold mb-2">Rank System</h2>
                    <p>"will be added later"</p>
                </div>
                <div>
                    <h2 class="text-xl font-bold mb-2">Acheivements and Awards</h2>
                    <p>"will be added later"</p>
                </div>
            </div> -->
            <div class="container mx-auto p-4 lg:p-3">
              <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
                
                <div v-for="index in num" class="mt-4 mb-4 overflow-hidden rounded-2xl shadow-xl shadow-secondary border border-tertiary smooth-transition hover:scale-105 p-4 bg-background bg-opacity-200 lg:p-12">
                  <div class="flex items-center text-blue-500">
                    <p class="text-sm font-bold uppercase">Feature 1 & Feature 2</p>
                  </div>
            
                  <h2 class="mt-4 text-3xl font-semibold text-slate-800">This is an Amazing Feature</h2>
            
                  <p class="mt-4 text-lg text-slate-600">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            
                  <div class="mt-12 flex transform items-center justify-center transition-transform duration-150 ease-in-out hover:scale-125">
            
                    <img src="../assets/devilfruit.png" />
            
                  </div>
                </div>
            
              </div>
            </div>
        </div>
    </div>
    <!-- component -->
</template>

<script setup lang="ts">

const num = ref(5)

const announcement = computed(() => {
  return [
    {
      title: 'Game Modes',
      subtitle: 'There are two game modes available:',
      image: 'image_url_1',
      description: ['Custom:', 'Activates power-ups during the game', 'Classic:', 'Play the game without any power-ups.']
    },
    {
      title: 'Players',
      subtitle: 'In both game modes, you have two options for players:',
      image: 'image_url_2',
      description: ['Single Player (with Bot):', 'Play alone against a computer-controlled opponent.', 'Online Multiplayer:', 'Play against someone online.' ]
    },
    {
      title: 'Controls',
      subtitle: 'Use the following controls to play the game:',
      image: 'image_url_2',
      description: ['Arrow Buttons:', 'Move the player paddle left and right.', '1 and 2 Buttons::', 'Activate power-ups.' ]
    },
  ];
});

</script>


<style>
h1 {
    @apply text-3xl font-bold mb-8;
}

h2 {
    @apply text-xl font-bold mb-2;
}

ul {
    @apply list-disc pl-6;
}

li {
    @apply mb-2 text-center;
}
</style>
