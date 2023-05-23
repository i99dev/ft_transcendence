export default defineNuxtPlugin((nuxtApp) => {
  const { play, stop, volume } = useSound()
  nuxtApp.vueApp.directive('click-effect', {
    mounted (el, binding) {
      el.addEventListener('click', function(event: any) {
        // Common logic for all elements with the directive
        console.log('click sound', binding.arg)
        play('click')
        if (binding.arg === 'play')
        {
          play('play')
          volume('play', 0.5)
        }
        if (binding.arg === 'unplay')
          stop('play')
        
        // Invoke the provided handler from the binding value
        binding.value(event);
      });
    },
    beforeUnmount (el, binding) {
      el.removeEventListener('click', binding.value)
    }
  })
})
