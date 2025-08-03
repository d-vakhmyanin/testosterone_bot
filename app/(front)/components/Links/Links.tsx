'use client';
import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';

import styles from './Links.module.css';

type LinkBaseProps = {
    path: string;
};

const LinkBase: React.FC<React.PropsWithChildren<LinkBaseProps>> = ({ path, children }) => {
    const pathname = usePathname();

    return (
        <Link href={path} className={`${styles.linkButton} ${pathname === path ? styles.active : ''}`}>
            {children}
        </Link>
    );
};

const EXERCISES_PATH = '/exercises';

export const ExercisesLink: React.FC = () => {
    return <LinkBase path={EXERCISES_PATH}>📋</LinkBase>;
};

const SETTINGS_PATH = '/settings';

export const SettingsLink: React.FC = () => {
    return <LinkBase path={SETTINGS_PATH}>⚙️</LinkBase>;
};

const MAIN_PATH = '/';

export const MainLink: React.FC = () => {
    return <LinkBase path={MAIN_PATH}>🎰</LinkBase>;
};
