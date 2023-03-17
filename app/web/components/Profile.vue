<template>
    <div>
        <div
            class="rounded-md absolute bg-white pt-8 pb-1 shadow-xl sm:mx-auto sm:px-10 border border-slate-900 items-center"
        >
            <div class="mb-2 flex flex-col items-center">
                <h1 class="mb-3 text-2xl text-blue-900 font-semibold">Setup Your Account</h1>

                <h1 class="text-xl mb-5 flex justify-center">Nickname</h1>
                <div>
                    <input
                        v-model="user.tmpNick"
                        class="rounded-md mb-2 placeholder:text-center placeholder::text-xl flex h-13 justify-center border"
                        type="text"
                        placeholder="Enter your username"
                    />
                </div>
                <h1 id="nameErrMsg" class="text-red-500 mb-2"></h1>
                <input id="fileUpload" type="file" hidden />
                <button>
                    <img
                        v-bind:src="user.tmpImg || user.image || user.defaultImages[0]"
                        @click="showAvatarWindow"
                        class="rounded-md border mb-3"
                        width="150"
                        alt=""
                        srcset=""
                    />
                </button>
                <div>
                    <button @click="$emit('close')" class="mt-5 mx-5 hover:text-sky-600">
                        Close
                    </button>
                    <button @click="updateProfile" class="mt-5 mx-5 hover:text-sky-600">
                        Submit
                    </button>
                </div>
            </div>
        </div>

        <div
            v-show="!user.imgSelected"
            class="absolute flex flex-wrap w-1/3 bg-white pt-8 pb-1 shadow-xl sm:mx-auto sm:px-10 border items-center opacity-95"
        >
            <p class="text-2xl mx-auto mb-3">Pick Your Avatar</p>
            <button class="flex flex-wrap">
                <img
                    @click="selectImageNew"
                    v-for="img in user.defaultImages"
                    :key="img"
                    :src="img"
                    class="border bg-slate-100 mx-0.5 mb-2 hover:to-blue-100"
                    width="145"
                    alt=""
                    srcset=""
                />
            </button>
            <img src="~/assets/upload_icon.png" class="w-7 mx-auto" @click="uploadImage" />
        </div>
    </div>
</template>

<script setup>
// props page
const props = defineProps({
    userData: {
        type: Object,
        required: true,
    },
})
const user = ref({
    login: props.userData.login,
    username: props.userData.username,
    image: props.userData.image,
    tmpNick: null,
    tmpImg: null,
    defaultImages: [
        'https://i1.ae/img/icons/1.png',
        'https://i1.ae/img/icons/2.png',
        'https://i1.ae/img/icons/3.png',
        'https://i1.ae/img/icons/4.png',
        'https://i1.ae/img/icons/5.png',
        'https://i1.ae/img/icons/6.png',
        'https://i1.ae/img/icons/7.png',
        'https://i1.ae/img/icons/15.png',
        'https://i1.ae/img/icons/8.png',
        'https://i1.ae/img/icons/9.png',
        'https://i1.ae/img/icons/10.png',
        'https://i1.ae/img/icons/11.png',
        'https://i1.ae/img/icons/12.png',
        'https://i1.ae/img/icons/13.png',
        'https://i1.ae/img/icons/14.png',
        'https://i1.ae/img/icons/16.png',
        'https://i1.ae/img/icons/17.png',
        'https://i1.ae/img/icons/18.png',
        'https://i1.ae/img/icons/19.png',
        'https://i1.ae/img/icons/20.png',
    ],
    code42: null,
    imgSelected: true,
})

onMounted(() => {
    user.value.tmpNick = user.value.username
})

const emit = defineEmits(['close'])

const uploadImage = () => {
    let input = document.createElement('input')
    input.type = 'file'
    input.onchange = e => {
        let x = e.target.files[0]
        user.value.tmpImg = URL.createObjectURL(x)
    }
    input.click()
    user.value.imgSelected = true
}
const showAvatarWindow = () => {
    console.log('TESTING :(')
    user.value.imgSelected = false
}

const selectImageNew = e => {
    user.value.tmpImg = e.target.src
    user.value.imgSelected = true
}

const updateProfile = async () => {
    if (user.value.tmpNick && user.value.tmpNick.length > 0 && user.value.tmpNick.length <= 10) {
        user.value.username = user.value.tmpNick
        if (user.value.tmpImg != null) {
            user.value.image = user.value.tmpImg
        }
        //Post req to update backend here
        const payload = {
            username: user.value.username,
            image: user.value.image,
        }
        await useUpdateUserInfo(user.value.login, payload)
        emit('close')
    } else {
        document.getElementById('nameErrMsg').innerHTML = 'Must be between 1-10 chars'
    }
}
</script>
