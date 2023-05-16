<template>
    <div>
        <div class="min-h-screen text-center justify-center overflow-hidden bg-gray-50 py-20">
			<div class="flex flex-col items-center">
				<div
					class="w-1 h-2 centered animate-bounce"
				>
            <h1
                class="text-primary mt-20 w-fit text-9xl whitespace-nowrap font-[CyberGlitch]"
            >
                {{ useRuntimeConfig().GAME_NAME }}
            </h1>
				</div>
			</div>
            <h1 class="text-2xl font-bold mb-20 mt-20">The Ping Pong Game</h1>
			<div>

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
						<li><strong>Arrow Buttons:</strong> Move the player paddle left and right.</li>
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
			</div>
		</div>
	</div>
</template>
	

<script setup lang="ts">
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
  