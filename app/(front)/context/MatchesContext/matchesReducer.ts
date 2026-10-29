import { Match } from '@/app/utils/hockey/matches';

type Filters = {
    activeTeams: number[];
    from?: Date;
    to?: Date;
};

export type MatchesState = {
    matches: Match[];
    hasPrev: boolean;
    hasNext: boolean;
    isLoading: boolean;
    filters: Filters;
    isGlobalLoading: boolean;
};

type MatchesAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_GLOBAL_LOADING'; payload: boolean }
    | { type: 'SET_FILTERS'; payload: Filters }
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
        case 'SET_GLOBAL_LOADING':
            return {
                ...state,
                isGlobalLoading: action.payload,
            };
        case 'SET_FILTERS':
            return {
                ...state,
                isGlobalLoading: true,
                filters: action.payload,
            };
        default:
            return state;
    }
};
