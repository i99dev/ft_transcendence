export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('test', {
    mounted (el, binding) {
      el.addEventListener('click', function(event: any) {

        // Common logic for all elements with the directive
        console.log('Common logic');
        
        // Invoke the provided handler from the binding value
        binding.value(event);
      });
  },
    getSSRProps (binding, vnode) {
      // you can provide SSR-specific props here
      return {}
    }
  })
})
