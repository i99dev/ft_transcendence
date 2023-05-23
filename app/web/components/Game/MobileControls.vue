<template>
    <div class="no-context-menu">
        <img @touchstart="$emit('touchStart', 'up')"
             @touchend="$emit('touchEnd', 'up')"
             src="/imgs/down_white.png" class="fixed transparent opacity-90 w-20 h-20 transform z-20" 
             :style="gameSetup.player === 0 ? { left: '1%' , top: '50%',transform: 'rotate(180deg) translateY(125%)',
              filter: 'invert' } : { right: '1%' , top: '50%',transform: 'rotate(180deg) translateY(125%)', filter: 'invert' }">

        <img @touchstart="$emit('touchStart', 'down')"
             @touchend="$emit('touchEnd', 'down')"
             src="/imgs/down_white.png" alt="downicon" class="fixed transparent opacity-90 w-20 h-20 transform z-20" 
             :style="gameSetup.player === 0 ? { left: '1%' , top: '50%',transform: 'translateY(20%)'}
             : { right: '1%' , top: '50%',transform: 'translateY(20%)'}">
    </div>
    
</template>
<script setup lang='ts'>
import Vue3TouchEvents from "vue3-touch-events";

const showw = ref(false)
let gameSetup = useState<SetupDto>('gameSetup')



</script>

<style>
.no-context-menu {
  user-select: none;
  -webkit-touch-callout: none;
}
</style>