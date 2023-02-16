<template>
		<div class="absolute bg-white  pt-8 pb-1 shadow-xl sm:mx-auto  sm:px-10 border border-slate-900 items-center">

			<div class="mb-2 flex flex-col items-center">
				<h1 class="mb-3 text-2xl font-semibold">Setup Your Aaaccount</h1>

				<h1 class="text-xl mb-1 flex justify-center"> Nickname</h1>
				<h1 class="text-xl mb-1 flex justify-center"> {{ user.nickname }}</h1>

				<input v-model="user.nickname"
					class=" mb-10 placeholder:text-center placeholder::text-xl   flex h-13  justify-center border"
					type="text" placeholder="Enter your nickname">
				<input id="fileUpload" type="file" hidden>
				<button>
					<img v-bind:src="user.image || user.defaultImages[0]" @click="showAvatarWindow" class="border mb-3"
						width="150" alt="" srcset="" />
				</button>

				<button class="mt-5  hover:text-sky-600">Submit</button>
			</div>

		</div>

		<div v-show="!user.imgSelected"
			class="absolute flex flex-wrap w-1/3 bg-white pt-8 pb-1 shadow-xl sm:mx-auto  sm:px-10 border items-center opacity-95">
			<p class="text-2xl mx-auto mb-3 ">Pick Your Avatar</p>
			<button class="flex flex-wrap">
				<img @click="selectImageNew" v-for="img in user.defaultImages" :src=img
					class="border bg-slate-100 mx-0.5 mb-2 hover:to-blue-100" width="145" alt="" srcset="" />
			</button>
			<!-- <button class="flex flex-wrap pt-5 pb-1  mr-auto ml-auto sm:mx-auto items-center opacity-100" @click="showAvatarWindow">
			</button> -->
			<img src="~/assets/upload_icon.png" class="w-7 mx-auto" @click="selectImage">
		</div>
</template>

<script setup>
const user = ref( {
	nickname: "",
	image: null,
	defaultImages:
		["https://i1.ae/img/icons/1.png",
			"https://i1.ae/img/icons/2.png",
			"https://i1.ae/img/icons/3.png",
			"https://i1.ae/img/icons/4.png",
			"https://i1.ae/img/icons/5.png",
			"https://i1.ae/img/icons/6.png",
			"https://i1.ae/img/icons/7.png",
			"https://i1.ae/img/icons/15.png",
			"https://i1.ae/img/icons/8.png",
			"https://i1.ae/img/icons/9.png",
			"https://i1.ae/img/icons/10.png",
			"https://i1.ae/img/icons/11.png",
			"https://i1.ae/img/icons/12.png",
			"https://i1.ae/img/icons/13.png",
			"https://i1.ae/img/icons/14.png",
			"https://i1.ae/img/icons/16.png",
			"https://i1.ae/img/icons/17.png",
			"https://i1.ae/img/icons/18.png",
			"https://i1.ae/img/icons/19.png",
			"https://i1.ae/img/icons/20.png"],
	code42: null,
	imgSelected: true
})
const selectImage = () => {
	let input = document.createElement('input');
	input.type = 'file';
	input.onchange = e => {
		let x = e.target.files[0];
		user.value.image = URL.createObjectURL(x);
	}
	input.click();
	user.value.imgSelected = true;
}
const showAvatarWindow = () => {
	console.log("TESTING :(")
	user.value.imgSelected = false;
}

const selectImageNew = (e) => {
	user.value.image = e.target.src;
	user.value.imgSelected = true;
}

</script>