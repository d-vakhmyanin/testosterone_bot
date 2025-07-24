import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Testosterone Bot TG',
    description: 'Web page for testosterone_super_bot',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="ru">
            <body className={inter.className}>{children}</body>
        </html>
    );
};

export default RootLayout;
