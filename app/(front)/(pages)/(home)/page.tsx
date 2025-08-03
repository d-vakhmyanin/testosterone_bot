'use client';

import React from 'react';

import styles from './home.module.css';
import { useHome } from './useHome';

import { Wheel } from '../../components/Wheel';
import { Modal } from '../../components/Modal/Modal';
import { SendButton } from '../../components/SendButton/SendButton';
import { Button } from '../../components/Button/Button';

const Home: React.FC = () => {
    const {
        state,
        settingsState,
        visibleExercises,
        saveButtonText,
        handleSpinFinish,
        handleCloseModal,
        handleStrangeButtonClick,
        handleHide,
        handleSave,
        handleInfo,
        handleDelete,
    } = useHome();

    return (
        <>
            <Wheel
                onSpinFinish={handleSpinFinish}
                segments={visibleExercises}
                duration={settingsState.wheelSettings.duration * 1000}
                minRotation={settingsState.wheelSettings.turnoverRange[0]}
                maxRotation={settingsState.wheelSettings.turnoverRange[1]}
            />
            <Modal isOpen={state.isModalOpen} onClose={handleCloseModal} title={state.exercise?.name}>
                <p>Поздравляю! Ты покрутил колесо!</p>
                <div className={styles.buttonsContainer}>
                    {state.exercise?.isProtected ? (
                        <>
                            <p>
                                Это упражнение - база. Его нельзя удалить или скрыть.
                                <br />
                                Но ты можешь попробовать нажать на кнокпу:
                            </p>
                            <React.Suspense>
                                <SendButton onClick={handleStrangeButtonClick} />
                            </React.Suspense>
                        </>
                    ) : (
                        <>
                            <Button onClick={handleHide} className={styles.basicButton}>
                                Скрыть
                            </Button>
                            <Button onClick={handleDelete} className={styles.basicButton}>
                                Удалить
                            </Button>
                        </>
                    )}
                    <Button
                        className={styles.bigButton}
                        onClick={handleSave}
                        disabled={state.isLoading || state.isSaved}
                    >
                        {saveButtonText}
                    </Button>
                    <Button className={styles.bigButton} onClick={handleInfo}>
                        Что это?
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default Home;
