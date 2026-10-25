'use client';
import React, { useEffect, useMemo, useRef } from 'react';
import { getMatches } from '@/app/utils/requests/getMatches';

import { matchesReducer, MatchesState } from './matchesReducer';
import { useSearchParams } from 'next/navigation';

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
};

const MatchesContext = React.createContext<MatchesContextType>({
    state: initialState,
    loadTop: () => {},
    loadBottom: () => {},
});

type MatchesProviderProps = {
    initialData: Awaited<ReturnType<typeof getMatches>>;
};

export const MatchesProvider: React.FC<React.PropsWithChildren<MatchesProviderProps>> = ({
    children,
    initialData,
}) => {
    const searchParams = useSearchParams();
    const [state, dispatch] = React.useReducer(matchesReducer, {
        ...initialState,
        matches: initialData.matches,
        hasNext: Boolean(initialData.hasNext),
        hasPrev: Boolean(initialData.hasPrev),
    });
    const firstRender = useRef(true);

    const filters = useMemo(() => {
        const activeTeams = searchParams.get('activeTeams');
        const from = searchParams.get('from');
        const to = searchParams.get('to');

        return { activeTeams, from, to };
    }, [searchParams]);

    const loadTop = React.useCallback(() => {
        if (state.isLoading || !state.hasPrev) {
            return;
        }

        dispatch({ type: 'SET_LOADING', payload: true });

        getMatches({
            edgeMatchId: state.matches.at(0)?.id,
            type: 'prev',
            filters,
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
    }, [state.matches, state.isLoading, state.hasPrev, filters]);

    const loadBottom = React.useCallback(() => {
        if (state.isLoading || !state.hasNext) {
            return;
        }

        dispatch({ type: 'SET_LOADING', payload: true });

        getMatches({ edgeMatchId: state.matches.at(-1)?.id, type: 'next', filters })
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
    }, [state.matches, state.isLoading, state.hasNext, filters]);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;

            return;
        }

        dispatch({ type: 'SET_LOADING', payload: true });

        getMatches({ type: 'now', filters })
            .then((data) => {
                dispatch({
                    type: 'SET_FULL_STATE',
                    payload: {
                        matches: data.matches,
                        hasPrev: Boolean(data.hasPrev),
                        hasNext: Boolean(data.hasNext),
                    },
                });
            })
            .finally(() => {
                dispatch({ type: 'SET_LOADING', payload: false });
            });
    }, [filters]);

    const value = React.useMemo(() => ({ state, loadTop, loadBottom }), [state, loadTop, loadBottom]);

    return <MatchesContext.Provider value={value}>{children}</MatchesContext.Provider>;
};

export const useMatches = () => {
    const context = React.useContext(MatchesContext);

    if (!context) {
        throw new Error('useMatches must be used within MatchesProvider');
    }

    return context;
};
