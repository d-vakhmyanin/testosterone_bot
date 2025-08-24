'use client';
import React from 'react';

import styles from './Wheel.module.css';
import { useWheel } from './useWheel';
import { Button } from '../Button/Button';

export type Segment = {
    name: string;
};

export type WheelProps<T extends Segment = Segment> = {
    segments: T[];
    duration?: number;
    minRotation?: number;
    maxRotation?: number;
    onSpinFinish: (result: T) => void;
};

const WheelSkeleton: React.FC = () => {
    return <div className={styles.wheelSkeleton} />;
};

export const Wheel = <T extends Segment>(props: WheelProps<T>) => {
    const { isMounted, canvasRef, isSpinning, curentSegment, handleSpinClick } = useWheel(
        props as unknown as WheelProps
    );

    if (!props.segments.length) {
        return <h3 className={styles.singleLine}>Нет упражнений</h3>;
    }

    return (
        <>
            <div className={styles.wheelWrapper}>
                <h3 className={styles.singleLine}>{curentSegment?.name}</h3>
                {isMounted ? <canvas ref={canvasRef} className={styles.wheel} /> : <WheelSkeleton />}
            </div>
            <Button onClick={handleSpinClick} disabled={isSpinning} view="red" className={styles.button}>
                {isSpinning ? 'Крутится...' : 'Крутить колесо!'}
            </Button>
        </>
    );
};
