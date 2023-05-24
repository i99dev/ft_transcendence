export default defineNuxtPlugin((nuxtApp) => {
  const { play, stop, volume, pause } = useSound()
  nuxtApp.vueApp.directive('click-effect', {
    mounted (el, binding) {
      el.addEventListener('click', function(event: any) {
        // Common logic for all elements with the directive
        play('click')
        if (binding.arg !== undefined)
        {
          if (binding.arg === 'unplay')
          {
            stop('play')
            play('login')
          }
          if (binding.arg === 'logout')
            stop('login')
          if (binding.arg === 'play' || binding.arg === 'login')
          {
              volume(binding.arg, 0.5)
              play(binding.arg)
              if (binding.arg === 'play')
                pause('login')
          }
        }
        // Invoke the provided handler from the binding value
        binding.value(event);
      });
    },
    beforeUnmount (el, binding) {
      el.removeEventListener('click', binding.value)
    }
  })
})
