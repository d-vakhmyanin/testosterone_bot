'use client';

import React from 'react';
import { MatchDetails, Match as MatchT } from '@/app/utils/hockey/matches';

import styles from './MatchPage.module.css';

import { Team } from '../Team/Team';
import { Modal } from '../Modal/Modal';
import { Bet as BetFC } from '../Bet/Bet';
import { Button } from '../Button/Button';
import { useMatchPage } from './useMatchPage';
import { NumberInput } from '../NumberInput/NumberInput';
import { NumberSlider } from '../NumberSlider/NumberSlider';
import { DateLabel } from '../DateLabel/DateLabel';
import { DetailsTabs } from '../DetailsTabs/DetailsTabs';

const periods = [
    { value: 'regulation', label: 'В основное время' },
    { value: 'overtime', label: 'В овертайме' },
    { value: 'shootout', label: 'По буллитам' },
];

export type MathPageProps = {
    match: MatchT;
    details?: MatchDetails;
    nextMatchId?: MatchT['id'];
};

export const MathPage: React.FC<MathPageProps> = (props) => {
    const { match, details } = props;
    const { homeTeam, guestTeam, result, isFinished } = match;
    const {
        state,
        hasStarted,
        isButtonDisabled,
        winType,
        closeModal,
        handleBetSubmit,
        handleTotalChange,
        handleWinTypeChange,
        handleModalButtonClick,
        handleHomeSliderChange,
        handleGuestSliderChange,
    } = useMatchPage(props);

    const renderContent = () => {
        if (!hasStarted) {
            return (
                <>
                    <div>
                        Тотал
                        <NumberInput
                            initialValue={0}
                            max={99}
                            min={0}
                            inputMode="numeric"
                            forceValue={state.isBetLoaded ? state.bet.total : undefined}
                            onChange={handleTotalChange}
                        />
                    </div>
                    <div>
                        Победа
                        {periods.map((period) => (
                            <label key={period.value} className={styles.radio}>
                                <input
                                    type="radio"
                                    className={styles.radioButton}
                                    name={period.value}
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
                        isLoading={state.isLoading}
                        disabled={isButtonDisabled}
                        onClick={handleBetSubmit}
                    >
                        Сделать ставку
                    </Button>
                </>
            );
        }

        return (
            <DetailsTabs
                homeTeam={homeTeam}
                guestTeam={guestTeam}
                details={details}
                bet={state.isBetLoaded ? { bet: state.bet, homeTeam, guestTeam, result } : undefined}
            />
        );
    };

    return (
        <div className={styles.container}>
            <DateLabel date={match.date} />
            {hasStarted ? (
                <div className={`${styles.liveBadge} ${isFinished ? '' : styles.warning}`}>
                    {details?.state || 'LIVE'}
                </div>
            ) : null}

            <div className={styles.matchHeader}>
                <Team {...homeTeam} />

                <div className={styles.scoreContainer}>
                    <div className={styles.score}>
                        <NumberSlider
                            initialValue={
                                hasStarted
                                    ? details?.score?.homeScore || result?.homeScore
                                    : state.bet.homeScore
                            }
                            isDisabled={hasStarted}
                            onChange={handleHomeSliderChange}
                        />
                        <span className={styles.scoreDivider}>:</span>
                        <NumberSlider
                            initialValue={
                                hasStarted
                                    ? details?.score?.guestScore || result?.guestScore
                                    : state.bet.guestScore
                            }
                            isDisabled={hasStarted}
                            onChange={handleGuestSliderChange}
                        />
                    </div>
                    {isFinished && result ? <div className={styles.resultInfo}>{winType}</div> : null}
                </div>

                <Team {...guestTeam} />
            </div>

            {renderContent()}

            <Modal isOpen={state.isSubmitted} onClose={closeModal} title="Cтавка сохранена" withConfetti>
                <BetFC bet={state.bet} homeTeam={homeTeam} guestTeam={guestTeam} />
                {props.nextMatchId ? (
                    <Button className={styles.modalButton} onClick={handleModalButtonClick}>
                        К следующему матчу
                    </Button>
                ) : null}
            </Modal>
        </div>
    );
};
