'use client';

import React, { Suspense } from 'react';

import styles from './page.module.css';
import { Wheel, Segment } from './components/Wheel';
import { Modal } from './components/Modal/Modal';
import { SendButton } from './components/SendButton/SendButton';

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

    const handleStrangeButtonClick = React.useCallback(
        (params: Record<string, string>) => {
            const body = {
                chatId: params.chatId,
                user: window.Telegram?.WebApp?.initDataUnsafe?.user,
                data: { segment },
            };

            fetch('/api/web-app-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
        },
        [segment]
    );

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <h1 className={styles.title}>Колесо</h1>
                <Wheel onSpinFinish={handleSpinFinish} />
                <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={segment?.name}>
                    <p>Поздравляю! Ты покрутил колесо!</p>
                    <Suspense>
                        <SendButton onClick={handleStrangeButtonClick} />
                    </Suspense>
                </Modal>
            </main>
        </div>
    );
};

export default Home;
