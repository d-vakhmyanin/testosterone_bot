import React from 'react';

import styles from './NumberInput.module.css';

import { Label } from '../Label/Label';

const minMax = (min: number, max: number, val: number) => Math.max(min, Math.min(max, val));

type NumberInputProps = {
    initialValue: number;
    forceValue?: number;
    min: number;
    max: number;
    onChange: (v: number) => void;
    title?: string;
    step?: number;
    name?: string;
    description?: string;
    inputMode?: 'numeric' | 'decimal';
};

export const NumberInput: React.FC<NumberInputProps> = ({
    title,
    initialValue,
    forceValue,
    min,
    max,
    step = 1,
    description = '',
    inputMode = 'numeric',
    name = 'NumberInput',
    onChange,
}) => {
    const [value, setValue] = React.useState(initialValue.toString());

    React.useEffect(() => {
        if (forceValue) {
            setValue(forceValue.toString());
        }
    }, [forceValue]);

    const handleChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value.replace(',', '.');

            const numValue = Number(newValue);

            if (Number.isNaN(numValue)) {
                return;
            }

            const quotient = numValue / step;

            if (numValue > max) {
                setValue(max.toString());
            } else if (Number.isInteger(quotient)) {
                setValue(newValue);
            } else {
                setValue((Math.round(quotient) * step).toString());
            }

            onChange(minMax(min, max, numValue));
        },
        [min, max, step, onChange]
    );

    const handleBlur = React.useCallback(() => {
        const numValue = Number(value);

        if (Number.isNaN(numValue) || numValue === 0) {
            const clampedValue = minMax(min, max, initialValue);
            setValue(clampedValue.toString());
            onChange(clampedValue);
        } else if (value.match(/\.0?$/)) {
            setValue(value.replace(/\.0?$/, ''));
        }
    }, [value, min, max, initialValue, onChange]);

    const increment = React.useCallback(() => {
        setValue((prev) => {
            const numValue = prev === '' ? initialValue : Number(prev);
            const newValue = minMax(min, max, numValue + step);
            onChange(newValue);

            return newValue.toString();
        });
    }, [min, max, step, initialValue, onChange]);

    const decrement = React.useCallback(() => {
        setValue((prev) => {
            const numValue = prev === '' ? initialValue : Number(prev);
            const newValue = minMax(min, max, numValue - step);
            onChange(newValue);

            return newValue.toString();
        });
    }, [min, max, initialValue, step, onChange]);

    return (
        <>
            {title ? (
                <Label text={title}>
                    <Label text={description} secondary />
                </Label>
            ) : null}
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
                    inputMode={inputMode}
                    pattern={inputMode === 'numeric' ? '[0-9]' : '[0-9]*.?[0-9]*'}
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
