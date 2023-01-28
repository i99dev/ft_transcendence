
<template>
	<div class="h-screen bg-gray300 flex items-center">
		<div class="bg-white  pt-8 pb-1 shadow-xl sm:mx-auto  sm:px-10 border items-center">

			<div class="mb-2 flex flex-col items-center">
				<h1 class="mb-3 text-2xl font-semibold">Setup Your Account</h1>

				<h1 class="text-xl mb-1 flex justify-center"> Nickname</h1>
				<h1 class="text-xl mb-1 flex justify-center"> {{ nickname }}</h1>

				<input v-model="nickname" class=" mb-10 placeholder:text-center flex  justify-center border" type="text"
					placeholder="Enter your nickname">

				<input id="fileUpload" type="file" hidden>
				<img v-bind:src="image || defualtImage" class="border mb-2" width="150" alt="" srcset="" />
				<button>
					<img src="~/assets/upload_icon.png" class="w-7" @click="selectImage()">
				</button>

				<dev>
					<button class="mt-7  hover:text-sky-600">Submit</button>
				</dev>
			</div>

		</div>
	</div>
</template>

<script>

export default {
	data() {
		return {
			nickname: "",
			image: null,
			defualtImage: "https://cdn3.iconfinder.com/data/icons/one-piece-colored/48/Cartoons__Anime_One_Piece_Artboard_6-512.png"
		}
	},
	methods: {
		selectImage() {
			let input = document.createElement('input');
			input.type = 'file';
			input.onchange = e => {
				let x = e.target.files[0];
				this.image = URL.createObjectURL(x);
			}
			input.click();
		}

	}

}
</script>