import React from 'react';
import { useRouter } from 'next/navigation';
import { Bet } from '@/app/utils/hockey/matches';
import { getBet } from '@/app/utils/requests/getBet';
import { saveBet } from '@/app/utils/requests/saveBet';

import { matchPageInitialState, matchPagereducer } from './matchReducer';

import { hockeyRoutes } from '../../utils/routes';
import { MathPageProps } from './MatchPage';

export const useMatchPage = ({ match, details, nextMatchId }: MathPageProps) => {
    const { id, date } = match;
    const [state, dispatch] = React.useReducer(matchPagereducer, matchPageInitialState);
    const router = useRouter();

    const hasStarted = React.useMemo(
        () => state.currentTime >= date || (details?.events.length || 0) > 0,
        [state.currentTime, details, date]
    );

    const isButtonDisabled = React.useMemo(
        () =>
            (state.bet.homeScore === 0 && state.bet.guestScore === 0) ||
            state.bet.homeScore === state.bet.guestScore ||
            (state.bet.winType !== 'regulation' &&
                Math.abs(state.bet.homeScore - state.bet.guestScore) !== 1) ||
            state.bet.total === 0,
        [state.bet]
    );

    const winType = React.useMemo(() => {
        if (match.result?.winType === 'regulation') {
            return 'Основное время';
        } else if (match.result?.winType === 'overtime') {
            return 'Овертайм';
        } else if (match.result?.winType === 'shootout') {
            return 'Буллиты';
        }

        return '';
    }, [match.result]);

    React.useLayoutEffect(() => {
        const timer = setInterval(() => {
            dispatch({ type: 'SET_CURRENT_TIME', payload: Date.now() });
        }, 30000);

        const handle = (e: Event) => {
            if (!hasStarted) {
                e.preventDefault();
            }
        };

        document.addEventListener('touchmove', handle, { passive: false });

        if (window.Telegram?.WebApp?.disableVerticalSwipes) {
            window.Telegram.WebApp.disableVerticalSwipes();
        }

        return () => {
            document.removeEventListener('touchmove', handle);
            clearInterval(timer);
        };
    }, [hasStarted]);

    React.useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

        if (userId) {
            getBet({ userId, matchId: id })
                .then(({ bet }) => {
                    dispatch({ type: 'SET_BET', payload: { bet, isLoaded: true } });
                })
                .catch();
        }
    }, [id]);

    const closeModal = React.useCallback(() => {
        dispatch({ type: 'SET_IS_SUBMITTED', payload: false });
    }, []);

    const handleHomeSliderChange = React.useCallback((score: number) => {
        dispatch({ type: 'UPDATE_BET', payload: { homeScore: score } });
    }, []);

    const handleGuestSliderChange = React.useCallback((score: number) => {
        dispatch({ type: 'UPDATE_BET', payload: { guestScore: score } });
    }, []);

    const handleTotalChange = React.useCallback((total: number) => {
        dispatch({ type: 'UPDATE_BET', payload: { total } });
    }, []);

    const handleWinTypeChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: 'UPDATE_BET', payload: { winType: e.target.value as Bet['winType'] } });
    }, []);

    const handleBetSubmit = React.useCallback(() => {
        const user = window.Telegram?.WebApp?.initDataUnsafe?.user;

        if (!user || state.isLoading) {
            return;
        }

        dispatch({ type: 'SET_IS_LOADING', payload: true });

        saveBet({ bet: state.bet, matchId: id, user })
            .then((res) => {
                dispatch({ type: 'SET_BET', payload: { bet: res.bet, isLoaded: false } });
                dispatch({ type: 'SET_IS_SUBMITTED', payload: true });
            })
            .finally(() => {
                dispatch({ type: 'SET_IS_LOADING', payload: false });
            });
    }, [state.isLoading, state.bet, id]);

    const handleModalButtonClick = React.useCallback(() => {
        if (nextMatchId) {
            router.replace(hockeyRoutes.match(nextMatchId));
        }
    }, [router, nextMatchId]);

    return {
        state,
        hasStarted,
        isButtonDisabled,
        winType,
        closeModal,
        handleBetSubmit,
        handleTotalChange,
        handleWinTypeChange,
        handleModalButtonClick,
        handleHomeSliderChange,
        handleGuestSliderChange,
    };
};
