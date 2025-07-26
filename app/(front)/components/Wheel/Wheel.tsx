'use client';
import React from 'react';

import styles from './Wheel.module.css';
import { useWheel } from './useWheel';

export type WheelProps = {
    segments?: number;
    duration?: number;
};

const WheelSkeleton: React.FC = () => {
    return <div className={`${styles.wheel} ${styles.wheelSkeleton}`} />;
};

export const Wheel: React.FC<WheelProps> = (props) => {
    const { canvasRef, isSpinning, handleSpinClick } = useWheel(props);

    return (
        <>
            {typeof window === 'undefined' ? (
                <WheelSkeleton />
            ) : (
                <canvas ref={canvasRef} className={styles.wheel} />
            )}
            <button onClick={handleSpinClick} disabled={isSpinning} className={styles.spinButton}>
                {isSpinning ? 'Крутится...' : 'Крутить колесо!'}
            </button>
        </>
    );
};
