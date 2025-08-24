import React from 'react';

import { SettingsContextProvider } from '@/app/(front)/context';
import { ExercisesLink, MainLink, SettingsLink } from '@/app/(front)/components/Links/Links';
import { MuscleGroupTabs } from '@/app/(front)/components/MuscleGroupTabs/MuscleGroupTabs';
import { PageTitle } from '@/app/(front)/components/PageTitle/PageTitle';

import styles from './layout.module.css';

const WheelLayout: React.FC<React.PropsWithChildren> = async ({ children }) => {
    return (
        <SettingsContextProvider>
            <nav className={styles.navigation}>
                <MainLink />
                <ExercisesLink />
                <SettingsLink />
            </nav>
            <MuscleGroupTabs />
            <main className={styles.main}>
                <PageTitle />
                {children}
            </main>
        </SettingsContextProvider>
    );
};

export default WheelLayout;
