import React from 'react';

import styles from './DateLabel.module.css';

const formatter = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
});

type DateLabelProps = {
    date: Date | number;
};

export const DateLabel: React.FC<DateLabelProps> = ({ date }) => {
    const d = typeof date === 'number' ? new Date(date) : date;
    const weekday = d.toLocaleString('ru-RU', { weekday: 'short' }).toLowerCase();
    const label = `${formatter.format(date)}, ${weekday}`;

    return <div className={styles.secondary}>{label}</div>;
};
