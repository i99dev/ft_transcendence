export default defineNuxtPlugin((nuxtApp) => {
  const clickEffect = (event:any , binding: any) => {
    // Common logic for all elements with the directive
    console.log('click sound')
    usePlaySoundEffect('click')
    // Invoke the provided handler from the binding value
    binding.value(event); 
  }
  nuxtApp.vueApp.directive('click-effect', {
    mounted (el, binding) {
      el.addEventListener('click', function(event: any) {
        // Common logic for all elements with the directive
        console.log('click sound')
        usePlaySoundEffect('click')
        // Invoke the provided handler from the binding value
        binding.value(event);
      });
    },
    beforeUnmount (el, binding) {
      el.removeEventListener('click', binding.value)
    }
  })
})
