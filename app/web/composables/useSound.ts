import mitt from 'mitt'


type ApplicationEvents = {
    'soundEffect' : 'click'
};

const emitter = mitt<ApplicationEvents>()

export const useEmit = emitter.emit

export const useListen = emitter.on

export const usePlaySoundEffect = (effect: string) => {
    const audio = new Audio(`/sounds/${effect}.mp3`)
    audio.play()
}