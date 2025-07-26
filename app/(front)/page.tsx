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

    const handleStrangeButtonClick = React.useCallback(() => {
        const data = {
            action: 'send_message',
            user: window.Telegram?.WebApp?.initDataUnsafe?.user,
        };
        window.Telegram?.WebApp?.sendData?.(JSON.stringify(data));
    }, []);

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <h1 className={styles.title}>Колесо</h1>
                <Wheel onSpinFinish={handleSpinFinish} />
                <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={segment?.name}>
                    <p>Поздравляю! Ты покрутил колесо!</p>
                    <button className={styles.sendButton} onClick={handleStrangeButtonClick}>
                        Это очень необычная кнопка.
                        <br />
                        Интересно, что она делает?
                    </button>
                </Modal>
            </main>
        </div>
    );
};

export default Home;
