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

        const title = isFinished ? 'Матч завершён' : 'Ставки сделаны, ставок больше нет';

        const winType = (() => {
            if (result?.winType === 'regulation') {
                return 'Основное время';
            } else if (result?.winType === 'overtime') {
                return 'Овертайм';
            } else if (result?.winType === 'shootout') {
                return 'Буллиты';
            }

            return null;
        })();

        return (
            <div className={styles.matchStatus}>
                <h3>{title}</h3>
                {isFinished && result ? <div className={styles.resultInfo}>{winType}</div> : null}
                {state.isBetLoaded ? (
                    <>
                        <div>Ваша ставка:</div>
                        <BetFC bet={state.bet} homeTeam={homeTeam} guestTeam={guestTeam} result={result} />
                    </>
                ) : null}
            </div>
        );
    };

    console.log({ match, details });

    return (
        <div className={styles.container}>
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
