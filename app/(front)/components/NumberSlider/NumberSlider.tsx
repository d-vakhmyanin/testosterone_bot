'use client';

import React from 'react';

import styles from './NumberSlider.module.css';

type NumberSliderProps = {
    isDisabled: boolean;
    onChange: (newValue: number) => void;
    initialValue?: number;
};

const min = 0;
const max = 99;

export const NumberSlider: React.FC<NumberSliderProps> = ({ initialValue = 0, isDisabled, onChange }) => {
    const [number, setNumber] = React.useState(initialValue);
    const touchStartY = React.useRef(0);

    React.useEffect(() => {
        setNumber(initialValue);
    }, [initialValue]);

    React.useEffect(() => {
        onChange(number);
    }, [onChange, number]);

    const handleWheel = React.useCallback(
        (e: React.WheelEvent) => {
            if (isDisabled) {
                return;
            }

            setNumber((prev) => {
                if (e.deltaY < 0) {
                    return Math.min(prev + 1, max);
                }

                return Math.max(prev - 1, min);
            });
        },
        [isDisabled]
    );

    const handleTouchMove = React.useCallback(
        (e: React.TouchEvent) => {
            if (isDisabled) {
                return;
            }

            const touchY = e.touches[0].clientY;
            const diff = touchStartY.current - touchY;

            if (Math.abs(diff) > 10) {
                setNumber((prev) => {
                    if (diff > 0) {
                        return Math.min(prev + 1, max);
                    }

                    return Math.max(prev - 1, min);
                });

                touchStartY.current = touchY;
            }
        },
        [isDisabled]
    );

    const handleTouchStart = React.useCallback((e: React.TouchEvent) => {
        touchStartY.current = e.touches[0].clientY;
    }, []);

    const handleClick = React.useCallback(() => {
        if (isDisabled) {
            return;
        }

        setNumber((prev) => Math.min(prev + 1, max));
    }, [isDisabled]);

    return (
        <div
            className={`${styles.scoreValue} ${isDisabled ? '' : styles.active}`}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onClick={handleClick}
        >
            {number}
        </div>
    );
};
