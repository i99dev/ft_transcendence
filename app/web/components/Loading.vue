<template>
  <div>
    <div class="half-circle-spinner aspect-square" :class="props?.size || 'w-16'">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['size'])
console.log(props?.size)
</script>

<style scoped>
.half-circle-spinner,
.half-circle-spinner * {
    box-sizing: border-box;
}

.half-circle-spinner {
    border-radius: 100%;
    position: relative;
}

.half-circle-spinner .circle {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 100%;
    border: calc(80px / 10) solid transparent;
}

.circle.circle-1 {
    border-top-color: #E93CAC;
    animation: half-circle-spinner-animation 1s infinite;
}

.circle.circle-2 {
    border-bottom-color: #59CBE8;
    animation: half-circle-spinner-animation 1s infinite alternate;
}

@keyframes half-circle-spinner-animation {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>