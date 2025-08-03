'use client';
import React from 'react';

import styles from './Wheel.module.css';
import { useWheel } from './useWheel';
import { Button } from '../Button/Button';

export type Segment = {
    name: string;
};

export type WheelProps = {
    segments?: Segment[];
    duration?: number;
    minRotation?: number;
    maxRotation?: number;
    onSpinFinish: (result: Segment) => void;
};

const WheelSkeleton: React.FC = () => {
    return <div className={styles.wheelSkeleton} />;
};

export const Wheel: React.FC<WheelProps> = (props) => {
    const { isMounted, canvasRef, isSpinning, curentSegment, handleSpinClick } = useWheel(props);

    if (!props.segments?.length) {
        return <h3 className={styles.singleLine}>Нет упражнений</h3>;
    }

    return (
        <>
            <div className={styles.wheelWrapper}>
                <h3 className={styles.singleLine}>{curentSegment?.name}</h3>
                {isMounted ? <canvas ref={canvasRef} className={styles.wheel} /> : <WheelSkeleton />}
            </div>
            <Button onClick={handleSpinClick} disabled={isSpinning} view="red">
                {isSpinning ? 'Крутится...' : 'Крутить колесо!'}
            </Button>
        </>
    );
};
