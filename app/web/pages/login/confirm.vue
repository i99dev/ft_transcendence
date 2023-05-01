<template>
  <div>
      <div class="centered flex-col h-screen w-full">
        <div class="centered flex-col" style="max-width: 80vw;">
          <h1 class="text-white text-xl md:text-2xl lg:text-3xl text-center capitalize p-2 mb-1">
            Hi <span class="capitalize text-white p-2 rounded-xl bg-primary">{{ useRoute().query.login }}</span>
          </h1>
          <h1 class="text-primary text-xl md:text-2xl lg:text-3xl text-center p-2 mb-1">
            Please enter the {{useRoute().query.code_length}}-digits verification code we sent via {{ useRoute().query.type }}
          </h1>
          <h3 class="text-white text-md md:text-lg lg:text-xl text-center mb-5 p-2">
            (we want to make sure it's you before going forward)
          </h3>
          <OTPInput @submitCode="submitCode"/>
          <h2 class="text-white text-md md:text-lg lg:text-xl text-center capitalize m-5 p-2">
            Didn't receive the code? <a class="text-primary underline underline-offset-8 ml-2" href="/login/resend">Resend</a>
          </h2>
          <!-- <button class="bg-primary hover:bg-slate-400 text-white p-2 rounded-xl ml-2"
              @click="submitCode"
          >
              Submit
            </button> -->
          </div>
      </div>
  </div>
</template>

<script lang="ts" setup>

definePageMeta({
  layout: false,
})

const submitCode = async (code: string) => {
  console.log()
  const login = useRoute().query.login
  if (login) {
    const {data, error} = await useSubmitConfirmationCode(login.toString(), code)
    if (data.value) {
      useCookie('access_token').value = data.value.access_token
      navigateTo('/')
    }
    else
      navigateTo('/login')
  }
}


</script>
