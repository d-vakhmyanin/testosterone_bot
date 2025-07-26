'use client';

import React from 'react';
import styles from './page.module.css';
import { Wheel, Segment } from './components/Wheel';

const Home = () => {
    const handleSpinClick = React.useCallback((res: Segment) => {
        console.log('res', res);
    }, []);

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <h1 className={styles.title}>Колесо</h1>
                <Wheel onSpinFinish={handleSpinClick} />
            </main>
        </div>
    );
};

export default Home;
