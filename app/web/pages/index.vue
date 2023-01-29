<template>

<div class="flex h-screen w-full items-center justify-center bg-gray-900 bg-no-repeat" style="background-image:url('https://i.pinimg.com/originals/be/f8/81/bef881862133387b96ad0fd47ea56468.gif'); background-size: 100% 100%; ">
		
	<div class="rounded-xl bg-gray-800 bg-opacity-50 px-16 py-10 shadow-lg backdrop-blur-md max-sm:px-8">
	
		<div class="text-white">
			
			<div class="mb-8 flex flex-col items-center">
			
				<img src="https://cdn-icons-png.flaticon.com/512/1178/1178864.png" width="100" alt="" srcset="" />
				
				<h1 class="mb-2 text-2xl">Ping Pong</h1>
				<!-- <span class="text-gray-300">Enter Login Details</span> -->
			
			</div>

			<form action="#">
				<div class="mt-8 flex justify-center text-lg text-black">		
				
					<button type="submit" class="rounded-3xl bg-gray-90 bg-opacity-50 px-20 py-2 text-white shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-yellow-600">
						<img src="https://signin.intra.42.fr/assets/42_logo-7dfc9110a5319a308863b96bda33cea995046d1731cebb735e41b16255106c12.svg" width="35" height="20" alt="icon">
						<NuxtLink to="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-0790e6eeae1028551e49d7958f62e9e0194a3816c15060dfedd2064583678acb&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin_new_user&response_type=code"></NuxtLink>
					</button>
				
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


