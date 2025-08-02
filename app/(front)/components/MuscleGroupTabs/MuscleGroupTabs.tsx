'use client';
import React from 'react';
import { usePathname } from 'next/navigation';

import styles from './MuscleGroupTabs.module.css';

import { MUSCLE_GROUP_TABS, useSettings } from '../../context';

export const MuscleGroupTabs = () => {
    const { state, setActiveTab } = useSettings();
    const pathname = usePathname();

    return (
        <div className={`${styles.tabs} ${pathname === '/settings' ? styles.hidden : ''}`}>
            {MUSCLE_GROUP_TABS.map((tab) => (
                <button
                    key={tab.value}
                    className={`${styles.tab} ${state.activeTab === tab.value ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab(tab.value)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};
