import mitt from 'mitt'


type ApplicationEvents = {
    'soundEffect' : 'click'
};

const emitter = mitt<ApplicationEvents>()

export const useEmit = emitter.emit

export const useListen = emitter.on

export const useSound = () => {
    const sound = useState<any | null>('sound', () => new Map([
        ['click', new Audio('/sounds/click.mp3')],
        ['play', new Audio('/sounds/ost1.mp3')],
    ]))
    const play = (effect: string) => {
        sound.value.get(effect).play()
    }
    const pause = (effect: string) => {
        sound.value.get(effect).pause()
    }
    const stop = (effect: string) => {
        sound.value.get(effect).pause()
        sound.value.get(effect).currentTime = 0
    }
    const loop = (effect: string) => {
        sound.value.get(effect).loop = true
    }
    const volume = (effect: string, volume: number) => {
        sound.value.get(effect).volume = volume
    }
    const isPaused = (effect: string) => {
        return sound.value.get(effect).paused
    }
    const isPlaying = (effect: string) => {
        return !sound.value.get(effect).paused
    }
    return { sound, play, pause, stop, loop, volume, isPaused, isPlaying }
}

