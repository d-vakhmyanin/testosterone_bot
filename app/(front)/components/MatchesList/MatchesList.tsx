import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Match as MatchT } from '@/app/utils/hockey/matches';

import styles from './MatchesList.module.css';

import { hockeyRoutes } from '../../utils/routes';

const Team: React.FC<MatchT['homeTeam']> = ({ id, name }) => {
    return (
        <div className={`${styles.column} ${styles.team}`}>
            <Image
                src={`/teams/image_team_${id}.png`}
                className={styles.image}
                alt={name}
                width={48}
                height={48}
                loading="eager"
            />
            <div className={styles.smallText}>{name}</div>
        </div>
    );
};

const Match: React.FC<MatchT> = ({ date, id, homeTeam, guestTeam }) => {
    const d = new Date(date);
    const minutes = d.getMinutes();
    const minutesStr = minutes < 10 ? `${minutes}0` : minutes;

    return (
        <Link className={styles.matchContainer} href={hockeyRoutes.match(id)}>
            <Team {...homeTeam} />
            <div className={styles.column}>
                <div className={styles.time}>
                    <span>{d.getHours()}</span>
                    <span>:</span>
                    <span>{minutesStr}</span>
                </div>
                <div className={`${styles.smallText} ${styles.secondary}`}>{homeTeam.city}</div>
            </div>
            <Team {...guestTeam} />
        </Link>
    );
};

type DateLabelProps = {
    date: Date;
};

const DateLabel: React.FC<DateLabelProps> = ({ date }) => {
    const formatter = new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
    });
    const weekday = date.toLocaleString('ru-RU', { weekday: 'short' });
    const label = `${formatter.format(date)}, ${weekday}`;

    return <div className={styles.secondary}>{label}</div>;
};

type MatchesListProps = {
    data: MatchT[];
};

let curDate: Date | undefined;

export const MatchesList: React.FC<MatchesListProps> = ({ data }) => {
    return (
        <div className={styles.listContainer}>
            {data.map((el, index) => {
                const elDate = new Date(el.date);
                let res: React.JSX.Element;

                if (curDate?.getDate() === elDate.getDate()) {
                    res = <Match key={el.id} {...el} />;
                } else {
                    curDate = elDate;

                    res = (
                        <React.Fragment key={el.id}>
                            <DateLabel date={elDate} />
                            <Match {...el} />
                        </React.Fragment>
                    );
                }

                if (index === data.length - 1) {
                    curDate = undefined;
                }

                return res;
            })}
        </div>
    );
};
