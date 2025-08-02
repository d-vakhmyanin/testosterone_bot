import Script from 'next/script';
import { Inter } from 'next/font/google';
import type { Metadata, Viewport } from 'next';

import './globals.css';
import { SettingsContextProvider } from './context';
import { getInitialSettings } from './context';
import styles from './layout.module.css';

import { Initialize } from '../(front)/components/Initialize';
import { MuscleGroupTabs } from './components/MuscleGroupTabs/MuscleGroupTabs';
import { PageTitle } from './components/PageTitle/PageTitle';
import { ExercisesLink, MainLink, SettingsLink } from './components/Links/Links';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
    title: 'Testosterone Bot TG',
    description: 'Web page for testosterone_super_bot',
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

const RootLayout: React.FC<React.PropsWithChildren> = async ({ children }) => {
    // server-side initialSettings
    const initialSettings = await getInitialSettings();

    return (
        <html lang="ru">
            <head>
                <Script
                    src="https://telegram.org/js/telegram-web-app.js?58"
                    async
                    strategy="beforeInteractive"
                />
            </head>
            <body className={inter.className}>
                <SettingsContextProvider {...initialSettings}>
                    <Initialize />
                    <div className={styles.page}>
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
                    </div>
                </SettingsContextProvider>
            </body>
        </html>
    );
};

export default RootLayout;
