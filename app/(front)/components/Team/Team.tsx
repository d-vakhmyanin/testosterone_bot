import React from 'react';
import Image from 'next/image';
import { Match as MatchT } from '@/app/utils/hockey/matches';

import styles from './Team.module.css';

export const TeamImage: React.FC<MatchT['homeTeam']> = ({ id, name }) => (
    <Image
        src={`/teams/image_team_${id}.svg`}
        className={styles.image}
        alt={name}
        width={48}
        height={48}
        loading="eager"
        priority
    />
);

export const Team: React.FC<MatchT['homeTeam']> = (props) => {
    return (
        <div className={styles.team}>
            <TeamImage {...props} />
            <div className={styles.smallText}>{props.name}</div>
        </div>
    );
};
