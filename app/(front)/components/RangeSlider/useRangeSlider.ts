import React from 'react';

import { RangeSliderProps } from './RangeSlider';

const getPercent = (val: number, max: number) => `${(val / max) * 100}%`;

export const useRangeSlider = ({ initialRange, min, max, handleChange }: RangeSliderProps) => {
    const [range, setRange] = React.useState<RangeSliderProps['initialRange']>(initialRange);
    const [dragging, setDragging] = React.useState<'min' | 'max' | null>(null);

    const sliderRef = React.useRef<HTMLDivElement>(null);

    const percentage = React.useMemo(
        () => ({
            left: getPercent(range[0], max),
            right: getPercent(range[1], max),
            width: getPercent(range[1] - range[0], max),
        }),
        [range, max]
    );

    // предотвращает скрытие webView по скроллу вниз при перетаскивании слайдера
    React.useLayoutEffect(() => {
        const slider = sliderRef.current;

        if (!slider) {
            return;
        }

        const handle = (e: Event) => {
            e.preventDefault();
        };

        slider.addEventListener('touchmove', handle, { passive: false });

        return () => {
            slider.removeEventListener('touchmove', handle);
        };
    }, []);

    const startDragMin = React.useCallback(() => {
        setDragging('min');
    }, []);

    const startDragMax = React.useCallback(() => {
        setDragging('max');
    }, []);

    const endDrag = React.useCallback(() => {
        setRange((prev) => {
            handleChange(prev);

            return prev;
        });

        setDragging(null);
    }, [handleChange]);

    const handleMove = React.useCallback(
        (e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
            if (!dragging || !sliderRef.current) {
                return;
            }

            const clientX = 'clientX' in e ? e.clientX : e.touches[0].clientX;

            const rect = sliderRef.current.getBoundingClientRect();
            const position = (clientX - rect.left) / rect.width;
            const value = Math.max(min, Math.min(max, position * max));

            setRange(([prevMin, prevMax]) => {
                const newValue =
                    dragging === 'min'
                        ? ([Math.min(value, prevMax - 0.1), prevMax] as RangeSliderProps['initialRange'])
                        : ([prevMin, Math.max(value, prevMin + 0.1)] as RangeSliderProps['initialRange']);

                return newValue;
            });
        },
        [dragging, min, max]
    );

    return {
        range,
        percentage,
        sliderRef,
        startDragMin,
        startDragMax,
        endDrag,
        handleMove,
    };
};
