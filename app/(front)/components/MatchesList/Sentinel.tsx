import React from 'react';

import styles from './MatchesList.module.css';

type SentinelProps = {
    isHidden: boolean;
};

const SentinelBase = ({ isHidden }: SentinelProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    return (
        <div ref={ref} className={`${styles.sentinel} ${isHidden ? styles.hidden : ''}`}>
            <div className={styles.loadingDots}>
                <div className={styles.dot} />
                <div className={styles.dot} />
                <div className={styles.dot} />
            </div>
        </div>
    );
};

export const Sentinel = React.forwardRef(SentinelBase);
