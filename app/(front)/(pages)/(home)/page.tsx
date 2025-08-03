'use client';

import React from 'react';

import { Segment, Wheel } from '../../components/Wheel';
import { Modal } from '../../components/Modal/Modal';
import { SendButton } from '../../components/SendButton/SendButton';
import { useSettings } from '../../context';

const Home: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [segment, setSegment] = React.useState<Segment>();
    const { visibleExercises, state } = useSettings();

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
        <>
            <Wheel
                onSpinFinish={handleSpinFinish}
                segments={visibleExercises}
                duration={state.wheelSettings.duration * 1000}
                minRotation={state.wheelSettings.turnoverRange[0]}
                maxRotation={state.wheelSettings.turnoverRange[1]}
            />
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={segment?.name}>
                <p>Поздравляю! Ты покрутил колесо!</p>
                <React.Suspense>
                    <SendButton onClick={handleStrangeButtonClick} />
                </React.Suspense>
            </Modal>
        </>
    );
};

export default Home;
