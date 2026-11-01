import React from 'react';
import { MatchDetails } from '@/app/utils/hockey/matches';

import styles from './Stats.module.css';

type StatsProps = {
    data: MatchDetails['stats'];
};

const getPercents = (home: number, guest: number): { home: number; guest: number } => {
    const total = home + guest;
    if (total <= 0) {
        return { home: 50, guest: 50 };
    }
    const homePct = (home / total) * 100;
    return { home: homePct, guest: 100 - homePct };
};

export const Stats: React.FC<StatsProps> = ({ data }) => {
    if (data.length === 0) {
        return <div className={styles.empty}>Нет статистики</div>;
    }

    return (
        <div className={styles.stats}>
            {data.map((stat, index) => {
                const { home, guest } = getPercents(stat.homeTeam, stat.guestTeam);
                return (
                    <div key={index} className={styles.row}>
                        <div className={`${styles.value} ${styles.left}`}>
                            <strong>{stat.homeTeam}</strong>
                        </div>
                        <div className={styles.rowTitle}>{stat.name}</div>
                        <div className={`${styles.value} ${styles.right}`}>
                            <strong>{stat.guestTeam}</strong>
                        </div>
                        <div className={styles.line}>
                            <div
                                className={`${styles.lineValue} ${styles.left}`}
                                style={{ width: `calc(${home}% - 1.5px)` }}
                            />
                            <div
                                className={`${styles.lineValue} ${styles.right}`}
                                style={{ width: `calc(${guest}% - 1.5px)` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
