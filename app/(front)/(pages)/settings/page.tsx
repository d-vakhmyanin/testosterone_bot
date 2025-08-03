'use client';

import React from 'react';

import styles from './Settings.module.css';

import { NumberInput } from '../../components/NumberInput/NumberInput';
import { useSettings } from '../../context';
import { RangeSlider } from '../../components/RangeSlider/RangeSlider';
import { Modal } from '../../components/Modal/Modal';
import { Button } from '../../components/Button/Button';

const MIN = 1;
const MAX = 100;
const MAX_DURATION = 30;

const SettingsPage: React.FC = () => {
    const { state, initialized, setWheelDuration, setWheelRange, restoreDefaults } = useSettings();
    const [isModalVisible, setModalVisible] = React.useState(false);

    const openModal = React.useCallback(() => {
        setModalVisible(true);
    }, []);

    const closeModal = React.useCallback(() => {
        setModalVisible(false);
    }, []);

    const handleRestore = React.useCallback(() => {
        restoreDefaults();
        window.location.reload();
    }, [restoreDefaults]);

    if (!initialized) {
        return null;
    }

    return (
        <>
            <div className={styles.settingGroup}>
                <NumberInput
                    title="Длительность вращения (сек):"
                    description="Влияет только на визуализацию"
                    min={MIN}
                    max={MAX_DURATION}
                    initialValue={state.wheelSettings.duration}
                    onChange={setWheelDuration}
                />
            </div>

            <div className={styles.settingGroup}>
                <RangeSlider
                    title="Диапазон оборотов:"
                    description="Влияет на вероятности! Чем больше разброс, тем рандомнее"
                    min={MIN}
                    max={MAX}
                    initialRange={state.wheelSettings.turnoverRange}
                    handleChange={setWheelRange}
                />
            </div>

            <Button onClick={openModal}>Восстановить дефолтные значения</Button>
            <Modal isOpen={isModalVisible} title="ВНИМАНИЕ" onClose={closeModal} withConfetti={false}>
                <h3>Сбросится всё, в том числе списки упражнений</h3>
                <Button onClick={handleRestore} className={styles.clearButton} view="red">
                    Сбросить всё
                </Button>
            </Modal>
        </>
    );
};

export default SettingsPage;
