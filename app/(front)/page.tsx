'use client';

import React from 'react';
import styles from './page.module.css';
import { Wheel, Segment } from './components/Wheel';
import { Modal } from './components/Modal/Modal';

const Home = () => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [segment, setSegment] = React.useState<Segment>();

    const handleSpinFinish = React.useCallback((res: Segment) => {
        setIsModalOpen(true);
        setSegment(res);
    }, []);

    const handleCloseModal = React.useCallback(() => {
        setIsModalOpen(false);
    }, []);

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <h1 className={styles.title}>Колесо</h1>
                <Wheel onSpinFinish={handleSpinFinish} />
                <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={segment?.name}>
                    <p>Поздравляю! Ты покрутил колесо</p>
                </Modal>
            </main>
        </div>
    );
};

export default Home;
