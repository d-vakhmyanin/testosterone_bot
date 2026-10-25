import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { DateRange } from 'react-day-picker';
import { Team, TEAMS } from '@/app/utils/hockey/teams';

import { Modal } from '../../Modal/Modal';
import { IconFilters } from '../../Icons/IconFilters';
import { BackButton } from '../../BackButton/BackButton';
import { TeamImage } from '../../Team/Team';
import { IconCross } from '../../Icons/IconCross';
import { Calendar } from '../../Calendar/Calendar';

import styles from './FiltersModal.module.css';

export const FiltersModal: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();

    const [isOpen, setIsOpen] = useState(false);
    const [activeTeamsMap, setActiveTeamsMap] = useState<Record<Team['id'], boolean>>({});
    const [range, setRange] = useState<DateRange | undefined>();
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearDisabled = useMemo(() => {
        const hasActiveTeams = Object.keys(activeTeamsMap).length;
        const hasActiveRange = !!range;

        return !hasActiveTeams && !hasActiveRange;
    }, [activeTeamsMap, range]);

    const closeModal = useCallback(() => {
        setIsOpen(false);
    }, []);

    const handleTeamClick = useCallback((team: Team) => {
        setActiveTeamsMap((prev) => ({ ...prev, [team.id]: !prev[team.id] }));
    }, []);

    const clearFilters = useCallback(() => {
        setActiveTeamsMap({});
        setRange(undefined);
    }, []);

    const applyFilters = useCallback(() => {
        const params = new URLSearchParams();
        const activeTeams = Object.entries(activeTeamsMap)
            .filter(([, value]) => value)
            .map(([key]) => key);

        if (activeTeams.length) {
            params.set('activeTeams', activeTeams.join(','));
        }

        if (range?.from) {
            const from = new Date(range.from);
            from.setHours(0, 0, 0, 0);
            params.set('from', from.toISOString());
        }

        if (range?.to && range.to.getTime() !== range.from?.getTime()) {
            const to = new Date(range.to);
            to.setHours(23, 59, 59, 999);
            params.set('to', to.toISOString());
        }

        router.replace(`${pathname}?${params.toString()}`, { scroll: true });
    }, [router, pathname, activeTeamsMap, range]);

    useEffect(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            applyFilters();
        }, 300);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [applyFilters]);

    return (
        <>
            <div className={styles.container}>
                {clearDisabled ? null : (
                    <button className={styles.btn} onClick={clearFilters}>
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
                    <BackButton onCLick={closeModal} />
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
