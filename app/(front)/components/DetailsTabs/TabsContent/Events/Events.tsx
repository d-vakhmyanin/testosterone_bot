import React from 'react';
import { MatchDetails } from '@/app/utils/hockey/matches';

import styles from './Events.module.css';

import { IconGoal } from '../../../Icons/IconGoal';
import { IconPenalty } from '../../../Icons/IconPenalty';
import { IconPenaltyShot } from '../../../Icons/IconPenaltyShot';
import { IconTimeout } from '../../../Icons/IconTimeout';

type Event = MatchDetails['events'][number];

type EventsProps = {
    data: Event[];
};

const getPeriodLabel = (number: number): string => {
    switch (number) {
        case 4:
            return 'Овертайм';
        case 5:
            return 'Буллиты';
        case 1:
        case 2:
        case 3:
        default:
            return `${number} период`;
    }
};

const toDate = (value: Date | string): Date => (value instanceof Date ? value : new Date(value));

const formatMinute = (date: Date | string, baseHour: number): string => {
    const d = toDate(date);
    const totalMinutes = (d.getUTCHours() - baseHour) * 60 + d.getUTCMinutes();
    const minutes = Math.max(0, totalMinutes);
    const seconds = d.getUTCSeconds();
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const Icon: React.FC<{ type: Event['type'] }> = ({ type }) => {
    const icon = (() => {
        switch (type) {
            case 'goal':
                return <IconGoal />;
            case 'penalty':
                return <IconPenalty />;
            case 'penaltyShot':
                return <IconPenaltyShot />;
            case 'timeout':
                return <IconTimeout />;
            default:
                return null;
        }
    })();

    return <div className={styles.icon}>{icon}</div>;
};
type RowContentProps = {
    event: Event;
    minute: string;
    score?: string;
    badge?: string;
    badgeTone?: 'default' | 'warning';
    side: 'home' | 'guest';
};

const RowContent: React.FC<RowContentProps> = ({ event, minute, score, badge, badgeTone, side }) => {
    let body: React.ReactNode = null;

    switch (event.type) {
        case 'goal':
            body = (
                <>
                    <Icon type="goal" />
                    <div className={styles.info}>
                        <div className={styles.author}>{event.author}</div>
                        {event.assistants.length > 0 && (
                            <div className={styles.assistants}>
                                {event.assistants.map((a, i) => (
                                    <span key={i} className={styles.assistant}>
                                        {a}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            );
            break;
        case 'penalty':
            body = (
                <>
                    <Icon type="penalty" />
                    <div className={styles.info}>
                        <div className={styles.author}>{event.player}</div>
                        <div className={styles.assistants}>
                            <span className={styles.assistant}>{event.reason}</span>
                        </div>
                    </div>
                </>
            );
            break;
        case 'penaltyShot':
            body = (
                <>
                    <Icon type="penaltyShot" />
                    <div className={styles.info}>
                        <div className={styles.author}>{event.player}</div>
                        <div className={styles.assistants}>
                            <span className={styles.assistant}>{event.result}</span>
                        </div>
                    </div>
                </>
            );
            break;
        case 'timeout':
            body = (
                <>
                    <Icon type="timeout" />
                    <div className={styles.info}>
                        <div className={styles.author}>Тайм-аут</div>
                    </div>
                </>
            );
            break;
        default:
            return null;
    }

    const center = (
        <div className={styles.center}>
            <span className={styles.time}>{minute}</span>
            {score && <span className={styles.score}>{score}</span>}
            {badge && (
                <span className={`${styles.badge} ${badgeTone === 'warning' ? styles.badgeWarning : ''}`}>
                    {badge}
                </span>
            )}
        </div>
    );

    return (
        <div className={styles.row}>
            <div className={styles.side}>
                {side === 'home' ? <div className={styles.sideInnerHome}>{body}</div> : null}
            </div>
            {center}
            <div className={styles.side}>
                {side === 'guest' ? <div className={styles.sideInnerGuest}>{body}</div> : null}
            </div>
        </div>
    );
};

export const Events: React.FC<EventsProps> = ({ data }) => {
    if (data.length === 0) {
        return <div className={styles.empty}>Нет событий</div>;
    }

    const firstEvent = data.find((e) => e.type !== 'period') ?? data[0];
    const baseHour = 'date' in firstEvent ? toDate(firstEvent.date).getUTCHours() : 0;

    let homeScore = 0;
    let guestScore = 0;

    return (
        <div className={styles.events}>
            {data.map((event, index) => {
                if (event.type === 'period') {
                    return (
                        <div key={index} className={styles.period}>
                            {getPeriodLabel(event.number)}
                        </div>
                    );
                }

                let score: string | undefined;
                let badge: string | undefined;
                let badgeTone: 'default' | 'warning' | undefined;

                if (event.type === 'goal') {
                    if (event.team === 'home') homeScore++;
                    else guestScore++;
                    score = `${homeScore}:${guestScore}`;
                    badge = event.players;
                    badgeTone = 'default';
                } else if (event.type === 'penalty') {
                    badge = event.time;
                    badgeTone = 'warning';
                }

                const minute = formatMinute(event.date, baseHour);

                return (
                    <RowContent
                        key={index}
                        event={event}
                        minute={minute}
                        score={score}
                        badge={badge}
                        badgeTone={badgeTone}
                        side={event.team}
                    />
                );
            })}
        </div>
    );
};
