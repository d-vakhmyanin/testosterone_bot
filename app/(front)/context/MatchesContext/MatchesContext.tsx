'use client';
import React, { useCallback, useMemo } from 'react';
import { getMatches } from '@/app/utils/requests/getMatches';

import { matchesReducer, MatchesState } from './matchesReducer';
import { useSearchParams } from 'next/navigation';

const initialState: MatchesState = {
    matches: [],
    hasPrev: false,
    hasNext: false,
    isLoading: false,
    isGlobalLoading: false,
    filters: {
        activeTeams: [],
    },
};

type MatchesContextType = {
    state: MatchesState;
    loadTop: () => void;
    loadBottom: () => void;
    loadFilteredMatches: () => void;
    setGlobalLoading: (payload: boolean) => void;
};

const MatchesContext = React.createContext<MatchesContextType>({
    state: initialState,
    loadTop: () => {},
    loadBottom: () => {},
    loadFilteredMatches: () => {},
    setGlobalLoading: () => {},
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

    const filtersSearchParams = useMemo(() => {
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
            filters: filtersSearchParams,
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
    }, [state.matches, state.isLoading, state.hasPrev, filtersSearchParams]);

    const loadBottom = React.useCallback(() => {
        if (state.isLoading || !state.hasNext) {
            return;
        }

        dispatch({ type: 'SET_LOADING', payload: true });

        getMatches({ edgeMatchId: state.matches.at(-1)?.id, type: 'next', filters: filtersSearchParams })
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
    }, [state.matches, state.isLoading, state.hasNext, filtersSearchParams]);

    const loadFilteredMatches = useCallback(() => {
        const filters = (() => {
            const activeTeams =
                filtersSearchParams.activeTeams
                    ?.split(',')
                    .map(Number)
                    .filter((n) => !Number.isNaN(n)) || [];
            const from = filtersSearchParams.from ? new Date(filtersSearchParams.from) : null;
            const to = filtersSearchParams.to ? new Date(filtersSearchParams.to) : null;

            const res: (typeof state)['filters'] = { activeTeams };

            if (from && !Number.isNaN(from.getTime())) {
                res.from = from;
            }

            if (to && !Number.isNaN(to.getTime())) {
                res.to = to;
            }

            return res;
        })();

        if (
            filters.from?.getTime() === state.filters.from?.getTime() &&
            filters.to?.getTime() === state.filters.to?.getTime() &&
            filters.activeTeams.length === state.filters.activeTeams.length &&
            filters.activeTeams.every((t) => state.filters.activeTeams.includes(t))
        ) {
            return;
        }

        dispatch({ type: 'SET_FILTERS', payload: filters });

        getMatches({ type: 'now', filters: filtersSearchParams })
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
                dispatch({ type: 'SET_GLOBAL_LOADING', payload: false });
            });
    }, [filtersSearchParams, state.filters]);

    const setGlobalLoading = useCallback((payload: boolean) => {
        dispatch({ type: 'SET_GLOBAL_LOADING', payload });
    }, []);

    const value = React.useMemo(
        () => ({ state, setGlobalLoading, loadTop, loadBottom, loadFilteredMatches }),
        [state, setGlobalLoading, loadTop, loadBottom, loadFilteredMatches]
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
