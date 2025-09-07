'use client';

import React from 'react';
import { Match as MatchT } from '@/app/utils/hockey/matches';

import styles from './MatchPage.module.css';

import { Team } from '../Team/Team';
import { Modal } from '../Modal/Modal';
import { Bet as BetFC } from '../Bet/Bet';
import { Button } from '../Button/Button';
import { useMatchPage } from './useMatchPage';
import { NumberInput } from '../NumberInput/NumberInput';
import { NumberSlider } from '../NumberSlider/NumberSlider';
import { DateLabel } from '../DateLabel/DateLabel';

const periods = [
    { value: 'regulation', label: 'В основное время' },
    { value: 'overtime', label: 'В овертайме' },
    { value: 'shootout', label: 'По буллитам' },
];

export const MathPage: React.FC<MatchT> = (match) => {
    const { homeTeam, guestTeam, result, isFinished } = match;
    const {
        state,
        hasStarted,
        isButtonDisabled,
        closeModal,
        handleBetSubmit,
        handleTotalChange,
        handleWinTypeChange,
        handleModalButtonClick,
        handleHomeSliderChange,
        handleGuestSliderChange,
    } = useMatchPage(match);

    return (
        <div className={styles.container}>
            <Modal isOpen={state.isSubmitted} onClose={closeModal} title="Cтавка сохранена" withConfetti>
                <BetFC bet={state.bet} homeTeam={homeTeam} guestTeam={guestTeam} />
                <Button className={styles.modalButton} onClick={handleModalButtonClick}>
                    К следующему матчу
                </Button>
            </Modal>

            <DateLabel date={match.date} />
            <div className={styles.matchHeader}>
                <Team {...homeTeam} />

                <div className={styles.score}>
                    <NumberSlider
                        initialValue={hasStarted ? result?.homeScore : state.bet.homeScore}
                        isDisabled={hasStarted}
                        onChange={handleHomeSliderChange}
                    />
                    <span className={styles.scoreDivider}>:</span>
                    <NumberSlider
                        initialValue={hasStarted ? result?.guestScore : state.bet.guestScore}
                        isDisabled={hasStarted}
                        onChange={handleGuestSliderChange}
                    />
                    {hasStarted && !isFinished ? <div className={styles.liveBadge}>LIVE</div> : null}
                </div>

                <Team {...guestTeam} />
            </div>

            {hasStarted ? (
                <div className={styles.matchStatus}>
                    <h3>{isFinished ? 'Матч завершён' : 'Ставки сделаны, ставок больше нет'}</h3>
                    {isFinished && result ? (
                        <>
                            <div className={styles.resultInfo}>
                                {result.winType === 'regulation' && 'Основное время'}
                                {result.winType === 'overtime' && 'Овертайм'}
                                {result.winType === 'shootout' && 'Буллиты'}
                            </div>
                            {state.isBetLoaded ? (
                                <>
                                    <div>Ваша ставка:</div>
                                    <BetFC
                                        bet={state.bet}
                                        homeTeam={homeTeam}
                                        guestTeam={guestTeam}
                                        result={result}
                                    />
                                </>
                            ) : null}
                        </>
                    ) : null}
                </div>
            ) : (
                <>
                    <div>
                        Тотал
                        <NumberInput
                            initialValue={0}
                            forceValue={state.isBetLoaded ? state.bet.total : undefined}
                            max={99}
                            min={0}
                            step={0.5}
                            inputMode="decimal"
                            onChange={handleTotalChange}
                        />
                    </div>
                    <div>
                        Победа
                        {periods.map((period) => (
                            <label key={period.value} className={styles.radio}>
                                <input
                                    className={styles.radioButton}
                                    name={period.value}
                                    type="radio"
                                    value={period.value}
                                    checked={state.bet.winType === period.value}
                                    onChange={handleWinTypeChange}
                                />
                                {period.label}
                            </label>
                        ))}
                    </div>
                    <Button
                        className={styles.submitButton}
                        onClick={handleBetSubmit}
                        isLoading={state.isLoading}
                        disabled={isButtonDisabled}
                    >
                        Сделать ставку
                    </Button>
                </>
            )}
        </div>
    );
};
