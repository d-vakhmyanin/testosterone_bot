'use client';
import React from 'react';
import { getMatches } from '@/app/utils/requests/getMatches';
import { Match } from '@/app/utils/hockey/matches';

import { matchesReducer, MatchesState } from './matchesReducer';

const initialState: MatchesState = {
    matches: [],
    hasPrev: false,
    hasNext: false,
    isLoading: false,
};

type MatchesContextType = {
    state: MatchesState;
    loadTop: () => void;
    loadBottom: () => void;
    setFullState: (data: { matches: Match[]; hasPrev: boolean; hasNext: boolean }) => void;
};

const MatchesContext = React.createContext<MatchesContextType>({
    state: initialState,
    loadTop: () => {},
    loadBottom: () => {},
    setFullState: () => {},
});

type MatchesProviderProps = {
    initialData: Awaited<ReturnType<typeof getMatches>>;
};

export const MatchesProvider: React.FC<React.PropsWithChildren<MatchesProviderProps>> = ({
    children,
    initialData,
}) => {
    const [state, dispatch] = React.useReducer(matchesReducer, {
        ...initialState,
        matches: initialData.matches,
        hasNext: Boolean(initialData.hasNext),
        hasPrev: Boolean(initialData.hasPrev),
    });

    const loadTop = React.useCallback(() => {
        if (state.isLoading || !state.hasPrev) {
            return;
        }

        dispatch({ type: 'SET_LOADING', payload: true });

        getMatches({
            edgeMatchId: state.matches.at(0)?.id,
            type: 'prev',
        })
            .then((data) => {
                dispatch({
                    type: 'ADD_TOP_MATCHES',
                    payload: {
                        matches: data.matches,
                        hasMore: data.hasMore,
                    },
                });
            })
            .finally(() => {
                dispatch({ type: 'SET_LOADING', payload: false });
            });
    }, [state.matches, state.isLoading, state.hasPrev]);

    const loadBottom = React.useCallback(() => {
        if (state.isLoading || !state.hasNext) {
            return;
        }

        dispatch({ type: 'SET_LOADING', payload: true });

        getMatches({ edgeMatchId: state.matches.at(-1)?.id, type: 'next' })
            .then((data) => {
                dispatch({
                    type: 'ADD_BOTTOM_MATCHES',
                    payload: {
                        matches: data.matches,
                        hasMore: data.hasMore,
                    },
                });
            })
            .finally(() => {
                dispatch({ type: 'SET_LOADING', payload: false });
            });
    }, [state.matches, state.isLoading, state.hasNext]);

    const setFullState = React.useCallback(
        (data: { matches: Match[]; hasPrev: boolean; hasNext: boolean }) => {
            dispatch({ type: 'SET_FULL_STATE', payload: data });
        },
        []
    );

    const value = React.useMemo(
        () => ({ state, loadTop, loadBottom, setFullState }),
        [state, loadTop, loadBottom, setFullState]
    );

    return <MatchesContext.Provider value={value}>{children}</MatchesContext.Provider>;
};

export const useMatches = () => {
    const context = React.useContext(MatchesContext);

    if (!context) {
        throw new Error('useMatches must be used within MatchesProvider');
    }

    return context;
};
