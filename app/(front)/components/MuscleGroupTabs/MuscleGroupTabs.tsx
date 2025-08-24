'use client';
import React from 'react';
import { usePathname } from 'next/navigation';

import styles from './MuscleGroupTabs.module.css';

import { MUSCLE_GROUP_TABS, useSettings } from '../../context';
import { wheelRoutes } from '../../utils/routes';

export const MuscleGroupTabs = () => {
    const { state, setActiveTab } = useSettings();
    const pathname = usePathname();

    const activeTabRef = React.useRef<HTMLButtonElement>(null);

    React.useLayoutEffect(() => {
        requestAnimationFrame(() => activeTabRef.current?.scrollIntoView());
    }, []);

    return (
        <div className={`${styles.tabs} ${pathname === wheelRoutes.settings ? styles.hidden : ''}`}>
            {MUSCLE_GROUP_TABS.map((tab) => (
                <button
                    key={tab.value}
                    ref={state.activeTab === tab.value ? activeTabRef : null}
                    className={`${styles.tab} ${state.activeTab === tab.value ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab(tab.value)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};
