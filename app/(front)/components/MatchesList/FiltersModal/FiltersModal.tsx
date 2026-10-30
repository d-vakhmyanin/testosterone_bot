import React, { useCallback, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { DateRange } from 'react-day-picker';
import { Team, TEAMS } from '@/app/utils/hockey/teams';
import { useMatches } from '@/app/(front)/context';

import { Modal } from '../../Modal/Modal';
import { IconFilters } from '../../Icons/IconFilters';
import { TeamImage } from '../../Team/Team';
import { IconCross } from '../../Icons/IconCross';
import { Calendar } from '../../Calendar/Calendar';

import styles from './FiltersModal.module.css';
import { IconDone } from '../../Icons/IconDone';

type FiltersModalProps = {
    onClear?: () => void;
};

export const FiltersModal: React.FC<FiltersModalProps> = ({ onClear }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { state, setGlobalLoading } = useMatches();

    const [isOpen, setIsOpen] = useState(false);
    const [activeTeamsMap, setActiveTeamsMap] = useState(() =>
        state.filters.activeTeams.reduce<Record<Team['id'], boolean>>((acc, cur) => {
            acc[cur] = true;

            return acc;
        }, {})
    );

    const [range, setRange] = useState<DateRange | undefined>(() => {
        if (!state.filters.from && !state.filters.to) {
            return undefined;
        }

        return { from: state.filters.from, to: state.filters.to };
    });

    const clearDisabled = useMemo(() => {
        const hasActiveTeams = Object.keys(activeTeamsMap).length;
        const hasActiveRange = !!range;

        return !hasActiveTeams && !hasActiveRange;
    }, [activeTeamsMap, range]);

    const applyFilters = useCallback(
        (teams = activeTeamsMap, rangeArg: typeof range | null = range) => {
            const params = new URLSearchParams();
            const activeTeams = Object.entries(teams)
                .filter(([, value]) => value)
                .map(([key]) => key);

            if (activeTeams.length) {
                params.set('activeTeams', activeTeams.join(','));
            }

            if (rangeArg?.from) {
                const from = new Date(rangeArg.from);
                from.setHours(0, 0, 0, 0);
                params.set('from', from.toISOString());
            }

            if (rangeArg?.to && rangeArg.to.getTime() !== rangeArg.from?.getTime()) {
                const to = new Date(rangeArg.to);
                to.setHours(23, 59, 59, 999);
                params.set('to', to.toISOString());
            }

            if (params.toString() === searchParams.toString()) {
                return;
            }

            router.replace(`${pathname}?${params.toString()}`, { scroll: true });
            setGlobalLoading(true);
        },
        [router, pathname, activeTeamsMap, searchParams, range, setGlobalLoading]
    );

    const closeModal = useCallback(() => {
        applyFilters();
        setIsOpen(false);
    }, [applyFilters]);

    const handleTeamClick = useCallback((team: Team) => {
        setActiveTeamsMap((prev) => ({ ...prev, [team.id]: !prev[team.id] }));
    }, []);

    const clearFilters = useCallback(() => {
        setActiveTeamsMap({});
        setRange(undefined);
    }, []);

    const applyEmptyFilters = useCallback(() => {
        applyFilters({}, null);
        onClear?.();
    }, [applyFilters, onClear]);

    return (
        <>
            <div className={styles.container}>
                {clearDisabled ? null : (
                    <button className={styles.btn} onClick={applyEmptyFilters}>
                        <IconCross />
                    </button>
                )}
                <button
                    className={styles.btn}
                    onClick={() => {
                        setIsOpen(true);
                    }}
                >
                    <IconFilters />
                </button>
            </div>
            <Modal
                isOpen={isOpen}
                withConfetti={false}
                showCloseButton={false}
                modalClassName={styles.modal}
                overlayClassName={styles.overlay}
                onClose={closeModal}
            >
                <div className={styles.header}>
                    <div className={styles.done_button} onClick={closeModal}>
                        <IconDone />
                        Готово
                    </div>
                    <div className={styles.header_right}>
                        <Calendar value={range} onChange={setRange} />
                        <button className={styles.close_btn} onClick={clearFilters} disabled={clearDisabled}>
                            <IconCross />
                        </button>
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.teams_grid}>
                        {TEAMS.map((team) => (
                            <button
                                key={team.id}
                                className={`${styles.team} ${activeTeamsMap[team.id] ? styles.active : ''}`}
                                onClick={() => handleTeamClick(team)}
                            >
                                <TeamImage {...team} />
                                {team.name}
                            </button>
                        ))}
                    </div>
                </div>
            </Modal>
        </>
    );
};
