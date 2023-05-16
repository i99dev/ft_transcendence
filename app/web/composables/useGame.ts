import { useSocket } from '@/composables/Game/useSocket'
export const useGameApi = () => { }

export const useGame = () => {
    const game_info = useState<any | null>('game_info', () => {
        return {
            gameModalOpen: false,
            game: null,
        }
    })

    const setGameModalOpen = (open: boolean) => {
        game_info.value.gameModalOpen = open
    }

    const setGame = (game: any) => {
        game_info.value.game = game
    }

    return { game_info, setGameModalOpen, setGame }
}

export async function useGameHistory(ep_URL: string): Promise<MatchHistoryDto[] | null> {
    const api = useRuntimeConfig().API_URL
    const { data } = await useFetch<MatchHistoryDto[]>(`${ep_URL}`, {
        method: 'GET',
        baseURL: api,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
    })
    return data.value
}

export function useGameInvite() {
    const invite = useState<InviteDto | null>('invite', () => {
        return null;
    });

    //object that contains the type of the invite modal and the game type and the inviter
    const inviteModal = useState<InviteModal>('inviteModal', () => {
        return {
            open: false,
            type: '',
            gameType: '',
            target: '',
        };
    });

    const { socket } = useSocket();

    socket.value?.on('Invite-Received', (payload: InviteDto) => {
        console.log('Invite-Received', payload);
        invite.value = payload;
        inviteModal.value.type = 'invited';
        inviteModal.value.gameType = payload.gameType;
        inviteModal.value.open = true;
    });

    const send = (invite: InviteDto) => {
        socket.value?.emit('Send-Invite', JSON.stringify(invite));
    };

    const acceptInvite = () => {
        if (!invite.value) return;
        socket.value?.emit('Respond-Invite', { ...invite.value, accepted: true });
        inviteModal.value.open = false;
    };

    const declineInvite = () => {
        if (!invite.value) return;
        socket.value?.emit('Respond-Invite', { ...invite.value, accepted: false });
        inviteModal.value.open = false;
    };
    const reset = () => {
        invite.value = null;
        inviteModal.value.open = false;
        inviteModal.value.type = ''
        inviteModal.value.gameType = ''
    };

    return { invite, inviteModal, send, acceptInvite, declineInvite, reset };
}