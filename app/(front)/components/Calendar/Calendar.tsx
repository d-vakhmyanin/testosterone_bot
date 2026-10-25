import React, { useMemo, useState } from 'react';
import { DateRange, DayPicker } from 'react-day-picker';
import { ru } from 'react-day-picker/locale';

import { IconCalendar } from '../Icons/IconCalendar';

import styles from './Calendar.module.css';

const OPTIONS = {
    month: '2-digit',
    day: 'numeric',
} as const;

type CalendarProps = {
    value: DateRange | undefined;
    onChange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
};

export const Calendar: React.FC<CalendarProps> = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const rangeStr = useMemo(() => {
        if (value?.from && value.to && value.from.getTime() !== value.to.getTime()) {
            return `${value.from.toLocaleDateString('ru-RU', OPTIONS)} - ${value.to.toLocaleDateString(
                'ru-RU',
                OPTIONS
            )}`;
        }

        return value?.from?.toLocaleDateString('ru-RU', OPTIONS);
    }, [value]);

    return (
        <div className={styles.container}>
            <button
                className={styles.btn}
                onClick={() => {
                    setIsOpen((prev) => !prev);
                }}
            >
                {rangeStr ? <div>{rangeStr}</div> : null}
                <IconCalendar />
            </button>
            {isOpen ? (
                <div className={styles.popup}>
                    <DayPicker mode="range" selected={value} onSelect={onChange} locale={ru} animate />
                </div>
            ) : null}
        </div>
    );
};
