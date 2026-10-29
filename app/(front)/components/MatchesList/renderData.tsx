import React from 'react';

import { Match } from '../Match/Match';
import { DateLabel } from '../DateLabel/DateLabel';

import { MatchesListProps } from './MatchesList';
import styles from './MatchesList.module.css';

export const renderData = (data: MatchesListProps['data']) => {
    if (!data.length) {
        return <div className={styles.empty}>Матчей нет</div>;
    }

    let curDate: Date | undefined = undefined;

    return data.map((el) => {
        const elDate = new Date(el.date);

        if (
            curDate?.getDate() === elDate.getDate() &&
            curDate?.getMonth() === elDate.getMonth() &&
            curDate?.getFullYear() === elDate.getFullYear()
        ) {
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
