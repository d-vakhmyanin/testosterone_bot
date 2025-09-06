import { Bet } from '@/app/utils/hockey/matches';

type MatchPageState = {
    bet: Bet;
    currentTime: number;
    isSubmitted: boolean;
    isLoading: boolean;
    isBetLoaded: boolean;
};

type MatchPageAction =
    | { type: 'SET_BET'; payload: { bet: Bet; isLoaded: boolean } }
    | { type: 'UPDATE_BET'; payload: Partial<Bet> }
    | { type: 'SET_CURRENT_TIME'; payload: number }
    | { type: 'SET_IS_SUBMITTED'; payload: boolean }
    | { type: 'SET_IS_LOADING'; payload: boolean };

export const matchPageInitialState: MatchPageState = {
    bet: {
        homeScore: 0,
        guestScore: 0,
        total: 0,
        winType: 'regulation',
    },
    currentTime: Date.now(),
    isSubmitted: false,
    isLoading: false,
    isBetLoaded: false,
};

export const matchPagereducer = (state: MatchPageState, action: MatchPageAction): MatchPageState => {
    switch (action.type) {
        case 'SET_BET':
            return { ...state, bet: action.payload.bet, isBetLoaded: action.payload.isLoaded };
        case 'UPDATE_BET':
            return { ...state, bet: { ...state.bet, ...action.payload } };
        case 'SET_CURRENT_TIME':
            return { ...state, currentTime: action.payload };
        case 'SET_IS_SUBMITTED':
            return { ...state, isSubmitted: action.payload };
        case 'SET_IS_LOADING':
            return { ...state, isLoading: action.payload };
        default:
            return state;
    }
};
