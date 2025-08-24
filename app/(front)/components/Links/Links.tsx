'use client';
import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';

import styles from './Links.module.css';
import { wheelRoutes } from '../../utils/routes';

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

export const ExercisesLink: React.FC = () => {
    return <LinkBase path={wheelRoutes.exercises}>📋</LinkBase>;
};

export const SettingsLink: React.FC = () => {
    return <LinkBase path={wheelRoutes.settings}>⚙️</LinkBase>;
};

export const MainLink: React.FC = () => {
    return <LinkBase path={wheelRoutes.home}>🎰</LinkBase>;
};
