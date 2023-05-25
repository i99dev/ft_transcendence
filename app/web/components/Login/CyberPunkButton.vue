<template>
    <div>
        <button
            class="cybr-btn text-white before:bg-primary group hover:before:opacity-80 before:border-r-4 before:border-r-tertiary text-4xl font-[CyberGlitch]"
            v-click-effect="clickButton"
        >
            {{ buttonName }}
            <span aria-hidden class=""></span>
            <span
                aria-hidden
                class="cybr-btn__glitch bg-secondary before:border-r-4 before:border-r-tertiary"
                >{{ props.buttonName }}_</span
            >
            <span
                aria-hidden
                class="absolute -bottom-2 right-2 bg-tertiary group-hover:opacity-80 w-1/6 h-1/4 centered text-sm rounded-sm font-normal"
                >42</span
            >
        </button>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const buttonName = ref('Click Me!')
const props = defineProps({
    buttonName: {
        type: String,
    },
})
onMounted(() => {
    if (props.buttonName) buttonName.value = props.buttonName
})
const emit = defineEmits(['click'])

const clickButton = () => {
    if (props.buttonName) buttonName.value = props.buttonName?.concat('...')
    else buttonName.value = 'Click Me!...'
    emit('click')
}
</script>

<style scoped>
.cybr-btn {
    --clip: polygon(0 0, 100% 0, 100% 100%, 95% 100%, 95% 90%, 85% 90%, 85% 100%, 8% 100%, 0 70%);
    --border: 4px;
    --shimmy-distance: 5;
    --clip-one: polygon(0 2%, 100% 2%, 100% 95%, 95% 95%, 95% 90%, 85% 90%, 85% 95%, 8% 95%, 0 70%);
    --clip-two: polygon(
        0 78%,
        100% 78%,
        100% 100%,
        95% 100%,
        95% 90%,
        85% 90%,
        85% 100%,
        8% 100%,
        0 78%
    );
    --clip-three: polygon(
        0 44%,
        100% 44%,
        100% 54%,
        95% 54%,
        95% 54%,
        85% 54%,
        85% 54%,
        8% 54%,
        0 54%
    );
    --clip-four: polygon(0 0, 100% 0, 100% 0, 95% 0, 95% 0, 85% 0, 85% 0, 8% 0, 0 0);
    --clip-five: polygon(0 0, 100% 0, 100% 0, 95% 0, 95% 0, 85% 0, 85% 0, 8% 0, 0 0);
    --clip-six: polygon(
        0 40%,
        100% 40%,
        100% 85%,
        95% 85%,
        95% 85%,
        85% 85%,
        85% 85%,
        8% 85%,
        0 70%
    );
    --clip-seven: polygon(
        0 63%,
        100% 63%,
        100% 80%,
        95% 80%,
        95% 80%,
        85% 80%,
        85% 80%,
        8% 80%,
        0 70%
    );
    cursor: pointer;
    background: transparent;
    text-transform: uppercase;
    outline: transparent;
    letter-spacing: 2px;
    position: relative;
    font-weight: 700;
    border: 0;
    min-width: 300px;
    height: 75px;
    line-height: 75px;
    transition: background 0.2s;
}

.cybr-btn:after,
.cybr-btn:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    clip-path: var(--clip);
    z-index: -1;
}

.cybr-btn:before {
    transform: translate(var(--border), 0);
}

.cybr-btn__glitch {
    position: absolute;
    top: calc(var(--border) * -1);
    left: calc(var(--border) * -1);
    right: calc(var(--border) * -1);
    bottom: calc(var(--border) * -1);
    clip-path: var(--clip);
    animation: glitch 2s infinite;
    display: none;
}

.cybr-btn:hover .cybr-btn__glitch {
    display: block;
}

.cybr-btn__glitch:before {
    content: '';
    position: absolute;
    top: calc(var(--border) * 1);
    right: calc(var(--border) * 1);
    bottom: calc(var(--border) * 1);
    left: calc(var(--border) * 1);
    clip-path: var(--clip);
    /* background: var(--primary); */
    z-index: -1;
}

@keyframes glitch {
    0% {
        clip-path: var(--clip-one);
    }
    2%,
    8% {
        clip-path: var(--clip-two);
        transform: translate(calc(var(--shimmy-distance) * -1%), 0);
    }
    6% {
        clip-path: var(--clip-two);
        transform: translate(calc(var(--shimmy-distance) * 1%), 0);
    }
    9% {
        clip-path: var(--clip-two);
        transform: translate(0, 0);
    }
    10% {
        clip-path: var(--clip-three);
        transform: translate(calc(var(--shimmy-distance) * 1%), 0);
    }
    13% {
        clip-path: var(--clip-three);
        transform: translate(0, 0);
    }
    14%,
    21% {
        clip-path: var(--clip-four);
        transform: translate(calc(var(--shimmy-distance) * 1%), 0);
    }
    25% {
        clip-path: var(--clip-five);
        transform: translate(calc(var(--shimmy-distance) * 1%), 0);
    }
    30% {
        clip-path: var(--clip-five);
        transform: translate(calc(var(--shimmy-distance) * -1%), 0);
    }
    35%,
    45% {
        clip-path: var(--clip-six);
        transform: translate(calc(var(--shimmy-distance) * -1%));
    }
    40% {
        clip-path: var(--clip-six);
        transform: translate(calc(var(--shimmy-distance) * 1%));
    }
    50% {
        clip-path: var(--clip-six);
        transform: translate(0, 0);
    }
    55% {
        clip-path: var(--clip-seven);
        transform: translate(calc(var(--shimmy-distance) * 1%), 0);
    }
    60% {
        clip-path: var(--clip-seven);
        transform: translate(0, 0);
    }
    31%,
    61%,
    100% {
        clip-path: var(--clip-four);
    }
}
</style>
