import React from 'react';
import { MatchDetails } from '@/app/utils/hockey/matches';

import styles from './Players.module.css';

type Player = Required<MatchDetails>['players']['homeTeam'][number];

type PlayersProps = {
    data: Player[];
};

type Section = {
    key: string;
    label: string;
    players: Player[];
};

const POSITION_ORDER: { key: string; label: string }[] = [
    { key: 'нп', label: 'Нападающие' },
    { key: 'зщ', label: 'Защитники' },
    { key: 'вр', label: 'Вратари' },
];

const sortByNumber = (a: Player, b: Player): number => {
    const na = Number(a.number);
    const nb = Number(b.number);
    if (Number.isNaN(na) || Number.isNaN(nb)) {
        return a.number.localeCompare(b.number);
    }
    return na - nb;
};

const groupPlayers = (players: Player[]): Section[] => {
    const sections: Section[] = POSITION_ORDER.map(({ key, label }) => ({
        key,
        label,
        players: players.filter((p) => p.position === key).sort(sortByNumber),
    }));

    const known = new Set(POSITION_ORDER.map((p) => p.key));
    const rest = players.filter((p) => !known.has(p.position)).sort(sortByNumber);
    if (rest.length > 0) {
        sections.push({ key: 'other', label: 'Другие', players: rest });
    }

    return sections.filter((s) => s.players.length > 0);
};

export const Players: React.FC<PlayersProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <div className={styles.empty}>Нет состава</div>;
    }

    const sections = groupPlayers(data);

    return (
        <div className={styles.players}>
            {sections.map((section) => (
                <div key={section.key} className={styles.section}>
                    <div className={styles.sectionTitle}>{section.label}</div>
                    <ul className={styles.list}>
                        {section.players.map((player) => (
                            <li
                                key={`${player.position}-${player.number}-${player.name}`}
                                className={styles.item}
                            >
                                <span className={styles.number}>{player.number}</span>
                                <span className={styles.name}>{player.name}</span>
                                {player.time && <span className={styles.time}>{player.time}</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};
