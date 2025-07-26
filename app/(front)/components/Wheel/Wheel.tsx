'use client';
import React from 'react';

import styles from './Wheel.module.css';
import { useWheel } from './useWheel';

export type Segment = {
    name: string;
};

export type WheelProps = {
    segments?: Segment[];
    duration?: number;
    onSpinFinish: (result: Segment) => void;
};

const WheelSkeleton: React.FC = () => {
    return <div className={styles.wheelSkeleton} />;
};

export const Wheel: React.FC<WheelProps> = (props) => {
    const { isMounted, canvasRef, isSpinning, curentSegment, handleSpinClick } = useWheel(props);

    return (
        <>
            <div className={styles.wheelWrapper}>
                <p>{curentSegment?.name}</p>
                {isMounted ? <canvas ref={canvasRef} className={styles.wheel} /> : <WheelSkeleton />}
            </div>
            <button onClick={handleSpinClick} disabled={isSpinning} className={styles.spinButton}>
                {isSpinning ? 'Крутится...' : 'Крутить колесо!'}
            </button>
        </>
    );
};
