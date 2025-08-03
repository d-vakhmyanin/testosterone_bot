'use client';

import React from 'react';

import styles from './RangeSlider.module.css';
import { useRangeSlider } from './useRangeSlider';

import { Label } from '../Label/Label';
import { WheelSettings } from '../../context/SettingsContext/types';

export type RangeSliderProps = {
    title: string;
    initialRange: WheelSettings['turnoverRange'];
    max: number;
    min: number;
    handleChange: (range: WheelSettings['turnoverRange']) => void;
    description?: string;
};

export const RangeSlider: React.FC<RangeSliderProps> = (props) => {
    const { range, percentage, sliderRef, startDragMin, startDragMax, endDrag, handleMove } =
        useRangeSlider(props);

    const { title, description = '' } = props;

    return (
        <Label text={title}>
            <Label text={description} secondary>
                <div className={styles.rangeValue}>
                    {range[0].toFixed(1)} - {range[1].toFixed(1)}
                </div>

                <div
                    ref={sliderRef}
                    className={styles.rangeSlider}
                    onMouseMove={handleMove}
                    onTouchMove={handleMove}
                    onMouseUp={endDrag}
                    onTouchEnd={endDrag}
                    onTouchCancel={endDrag}
                >
                    <div className={styles.track}>
                        <div
                            className={styles.thumb}
                            style={{ left: percentage.left }}
                            onMouseDown={startDragMin}
                            onTouchStart={startDragMin}
                        />
                        <div
                            className={styles.thumb}
                            style={{ left: percentage.right }}
                            onMouseDown={startDragMax}
                            onTouchStart={startDragMax}
                        />
                        <div
                            className={styles.activeRange}
                            style={{ left: percentage.left, width: percentage.width }}
                        />
                    </div>
                </div>
            </Label>
        </Label>
    );
};
