import React from 'react';

import { Match } from '../Match/Match';
import { DateLabel } from '../DateLabel/DateLabel';

import { MatchesListProps } from './MatchesList';

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
