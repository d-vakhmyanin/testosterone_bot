import React from 'react';
import Link from 'next/link';
import { Match as MatchT } from '@/app/utils/hockey/matches';

import { hockeyRoutes } from '../../utils/routes';
import { Team } from '../Team/Team';

import styles from './Match.module.css';

const winTypeToLabel = {
    regulation: '',
    overtime: ' от',
    shootout: ' б',
};

export const Match: React.FC<MatchT> = ({ date, id, homeTeam, guestTeam, isFinished, result }) => {
    const d = new Date(date);
    const isStarted = new Date() >= d;
    const minutes = d.getMinutes();
    const minutesStr = minutes < 10 ? `${minutes}0` : minutes;

    return (
        <Link className={styles.matchContainer} href={hockeyRoutes.match(id)}>
            <Team {...homeTeam} />
            <div className={styles.column}>
                <div className={styles.time}>
                    <span>{result ? result.homeScore : d.getHours()}</span>
                    <span>:</span>
                    <span>
                        {result
                            ? `${result.guestScore}${winTypeToLabel[result.winType || 'regulation']}`
                            : minutesStr}
                    </span>
                </div>
                <div className={styles.smallText}>{homeTeam.city}</div>
                {isStarted || isFinished ? (
                    <div className={styles.smallText}>{isStarted ? 'Идёт сейчас' : 'Завершён'}</div>
                ) : null}
            </div>
            <Team {...guestTeam} />
        </Link>
    );
};
