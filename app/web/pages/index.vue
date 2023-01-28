<template>
<!-- component -->
<div class="flex h-screen w-full items-center justify-center bg-gray-900 bg-cover bg-no-repeat" style="background-image:url('https://i.pinimg.com/564x/8a/cd/8b/8acd8b3baaea6f28dc8de2c69c0a5143.jpg')">
	<div class="rounded-xl bg-gray-800 bg-opacity-50 px-16 py-10 shadow-lg backdrop-blur-md max-sm:px-8">
		<div class="text-white">
			<div class="mb-8 flex flex-col items-center">
				<img src="https://cdn3.iconfinder.com/data/icons/one-piece-colored/48/Cartoons__Anime_One_Piece_Artboard_6-512.png" width="150" alt="" srcset="" />
				<h1 class="mb-2 text-2xl">Something</h1>
				<span class="text-gray-300">Enter Login Details</span>
			</div>
			<form action="#">
				<div class="mb-4 text-lg">
					<input v-model="user.email" class="rounded-3xl border-none bg-blue-400 bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md" type="text" name="name" placeholder="id@email.com" />
					<p>{{ user.email }}</p>
				</div>
				
				<div class="mb-4 text-lg">
					<input v-model="user.password" class="rounded-3xl border-none bg-blue-400 bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md" type="Password" name="name" placeholder="*********" />
					<p>{{ user.password }}</p>
				</div>
				<div class="mt-8 flex justify-center text-lg text-black">
					<button @click="logData" type="submit" class="rounded-3xl bg-gray-90 bg-opacity-50 px-10 py-2 text-white shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-yellow-600">Login</button>
        </div>
      </form>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
	return {
	  user: {
		email: '',
		password: '',
	  },
	};
  },
  methods: {
	logData() {
	console.log(this.user.email);
	console.log(this.user.password);
	},
	  },
};


</script>


