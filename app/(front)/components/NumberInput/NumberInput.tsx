import React from 'react';

import styles from './NumberInput.module.css';

import { Label } from '../Label/Label';

const minMax = (min: number, max: number, val: number) => Math.max(min, Math.min(max, val));

type NumberInputProps = {
    title: string;
    min: number;
    max: number;
    initialValue: number;
    onChange: (v: number) => void;
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
    onChange,
}) => {
    const [value, setValue] = React.useState(initialValue.toString());

    const handleChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;

            if (newValue === '0') {
                return;
            }

            const numValue = Number(newValue);

            if (Number.isNaN(numValue)) {
                return;
            }

            if (numValue > max) {
                setValue(max.toString());
            } else {
                setValue(newValue);
            }

            onChange(minMax(min, max, numValue));
        },
        [min, max, onChange]
    );

    const handleBlur = React.useCallback(() => {
        const numValue = Number(value);

        if (Number.isNaN(numValue) || numValue === 0) {
            const clampedValue = minMax(min, max, initialValue);
            setValue(clampedValue.toString());
            onChange(clampedValue);
        }
    }, [value, min, max, initialValue, onChange]);

    const increment = React.useCallback(() => {
        setValue((prev) => {
            const numValue = prev === '' ? initialValue : Number(prev);
            const newValue = minMax(min, max, numValue + 1);
            onChange(newValue);

            return newValue.toString();
        });
    }, [min, max, initialValue, onChange]);

    const decrement = React.useCallback(() => {
        setValue((prev) => {
            const numValue = prev === '' ? initialValue : Number(prev);
            const newValue = minMax(min, max, numValue - 1);
            onChange(newValue);

            return newValue.toString();
        });
    }, [min, max, initialValue, onChange]);

    return (
        <>
            <Label text={title}>
                <Label text={description} secondary />
            </Label>
            <div className={styles.inputContainer}>
                <button
                    type="button"
                    onClick={decrement}
                    className={styles.controlButton}
                    aria-label="Decrease value"
                >
                    -
                </button>
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    name={name}
                    min={min}
                    max={max}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={styles.numberInput}
                />
                <button
                    type="button"
                    onClick={increment}
                    className={styles.controlButton}
                    aria-label="Increase value"
                >
                    +
                </button>
            </div>
        </>
    );
};
