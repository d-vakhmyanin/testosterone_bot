import Script from 'next/script';
import { Inter } from 'next/font/google';
import type { Metadata, Viewport } from 'next';

import './globals.css';
import styles from './layout.module.css';
import { GlobalNavigation } from './components/GlobalNavigation/GlobalNavigation';

import { Initialize } from '../(front)/components/Initialize';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
    title: 'Testosterone Bot TG',
    description: 'Web page for testosterone_super_bot',
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
};

const RootLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <html lang="ru">
            <head>
                <Script
                    src="https://telegram.org/js/telegram-web-app.js?58"
                    async
                    strategy="beforeInteractive"
                    crossOrigin="anonymous"
                />
            </head>
            <body className={inter.className}>
                <Initialize />
                <div className={styles.page}>
                    {children}
                    <GlobalNavigation />
                </div>
            </body>
        </html>
    );
};

export default RootLayout;
