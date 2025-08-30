import React from 'react';

import { Match } from '../Match/Match';

import styles from './MatchesList.module.css';
import { MatchesListProps } from './MatchesList';

type DateLabelProps = {
    date: Date;
};

const DateLabel: React.FC<DateLabelProps> = ({ date }) => {
    const formatter = new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
    });
    const weekday = date.toLocaleString('ru-RU', { weekday: 'short' }).toLowerCase();
    const label = `${formatter.format(date)}, ${weekday}`;

    return <div className={styles.secondary}>{label}</div>;
};

export const renderData = (data: MatchesListProps['data']) => {
    let curDate: Date | undefined = undefined;

    return data.map((el) => {
        const elDate = new Date(el.date);

        if (curDate?.getDate() === elDate.getDate()) {
            return <Match key={el.id} {...el} />;
        } else {
            curDate = elDate;

            return (
                <React.Fragment key={el.id}>
                    <DateLabel date={elDate} />
                    <Match {...el} />
                </React.Fragment>
            );
        }
    });
};
