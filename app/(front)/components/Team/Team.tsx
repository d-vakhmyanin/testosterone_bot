import React from 'react';
import Image from 'next/image';
import { Match as MatchT } from '@/app/utils/hockey/matches';

import styles from './Team.module.css';

export const Team: React.FC<MatchT['homeTeam']> = ({ id, name }) => {
    return (
        <div className={styles.team}>
            <Image
                src={`/teams/image_team_${id}.png`}
                className={styles.image}
                alt={name}
                width={48}
                height={48}
                loading="eager"
                priority
            />
            <div className={styles.smallText}>{name}</div>
        </div>
    );
};
