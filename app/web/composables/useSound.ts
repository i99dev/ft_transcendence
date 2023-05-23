import mitt from 'mitt'


type ApplicationEvents = {
    'soundEffect' : 'click'
};

const emitter = mitt<ApplicationEvents>()

export const useEmit = emitter.emit

export const useListen = emitter.on

