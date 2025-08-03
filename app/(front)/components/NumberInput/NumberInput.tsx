import React from 'react';

import styles from './NumberInput.module.css';

import { Label } from '../Label/Label';

type NumberInputProps = {
    title: string;
    min: number;
    max: number;
    initialValue: number;
    handleChange: (v: number) => void;
    name?: string;
    description?: string;
};

export const NumberInput: React.FC<NumberInputProps> = ({
    title,
    initialValue,
    min,
    max,
    description = '',
    name = 'NumberInput',
    handleChange,
}) => {
    const [value, setValue] = React.useState(initialValue);

    const handleDurationChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = Math.max(min, Math.min(max, Number(e.target.value)));
            setValue(newValue);
            handleChange(newValue);
        },
        [min, max, handleChange]
    );

    return (
        <Label text={title}>
            <Label text={description} secondary>
                <input
                    type="number"
                    name={name}
                    min={min}
                    max={max}
                    value={value}
                    onChange={handleDurationChange}
                    className={styles.numberInput}
                />
            </Label>
        </Label>
    );
};
