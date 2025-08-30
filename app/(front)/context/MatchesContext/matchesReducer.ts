import { Match } from '@/app/utils/hockey/matches';

export type MatchesState = {
    matches: Match[];
    hasPrev: boolean;
    hasNext: boolean;
    isLoading: boolean;
};

type MatchesAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'ADD_TOP_MATCHES'; payload: { matches: Match[]; hasMore: boolean } }
    | { type: 'ADD_BOTTOM_MATCHES'; payload: { matches: Match[]; hasMore: boolean } }
    | { type: 'SET_FULL_STATE'; payload: { matches: Match[]; hasPrev: boolean; hasNext: boolean } };

export const matchesReducer = (state: MatchesState, action: MatchesAction): MatchesState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'ADD_TOP_MATCHES':
            return {
                ...state,
                matches: [...action.payload.matches, ...state.matches],
                hasPrev: action.payload.hasMore,
                isLoading: false,
            };
        case 'ADD_BOTTOM_MATCHES':
            return {
                ...state,
                matches: [...state.matches, ...action.payload.matches],
                hasNext: action.payload.hasMore,
                isLoading: false,
            };
        case 'SET_FULL_STATE':
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
};
