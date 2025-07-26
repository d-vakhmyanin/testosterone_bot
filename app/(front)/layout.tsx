import Script from 'next/script';
import { Inter } from 'next/font/google';
import type { Metadata, Viewport } from 'next';

import './globals.css';
import { Initialize } from './components/Initialize';

const inter = Inter({ subsets: ['latin'] });

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

const RootLayout = ({ children }: { children: React.ReactNode }) => {
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
                <Initialize />
                {children}
            </body>
        </html>
    );
};

export default RootLayout;
