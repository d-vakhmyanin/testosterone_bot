import React from 'react';
import { Bet as BetT, Match } from '@/app/utils/hockey/matches';

import styles from './Bet.module.css';

const getEmoji = (res: unknown, condition: boolean) => {
    if (!res) {
        return null;
    }

    return condition ? '✅' : '❌';
};

type BetProps = {
    bet: BetT;
    homeTeam: Match['homeTeam'];
    guestTeam: Match['guestTeam'];
    result?: Match['result'];
};

export const Bet: React.FC<BetProps> = ({ bet, homeTeam, guestTeam, result }) => {
    const { homeScore, guestScore, winType, total } = bet;

    const winTypeLabel = React.useMemo(() => {
        switch (winType) {
            case 'overtime':
                return 'В овертайме';
            case 'shootout':
                return 'По буллитам';
            case 'regulation':
            default:
                return 'В основное время';
        }
    }, [winType]);

    const { betWinningTeam, realWinningTeam } = React.useMemo(() => {
        const betWinningTeam = homeScore > guestScore ? homeTeam.name : guestTeam.name;

        if (!result) {
            return { betWinningTeam };
        }

        const realWinningTeam = result.homeScore > result.guestScore ? homeTeam.name : guestTeam.name;

        return { betWinningTeam, realWinningTeam };
    }, [result, guestTeam, homeTeam, homeScore, guestScore]);

    return (
        <div className={styles.bet}>
            <div>
                Победа команды {betWinningTeam} {getEmoji(result, realWinningTeam === betWinningTeam)}
            </div>
            <div>
                Со счётом {homeScore}:{guestScore}{' '}
                {getEmoji(result, homeScore === result?.homeScore && guestScore === result.guestScore)}
            </div>
            <div>
                {winTypeLabel} {getEmoji(result, result?.winType === winType)}
            </div>
            <div>
                Тотал: {total}{' '}
                {getEmoji(result, (result?.homeScore || 0) + (result?.guestScore || 0) >= total)}
            </div>
        </div>
    );
};
