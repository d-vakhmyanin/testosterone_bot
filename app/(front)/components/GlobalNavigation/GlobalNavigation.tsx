'use client';

import React from 'react';
import Link from 'next/link';

import { IconStick } from '../Icons/IconStick';
import { IconWheel } from '../Icons/IconWheel';
import { hockeyRoutes, wheelRoutes } from '../../utils/routes';

import styles from './GlobalNavigation.module.css';
import { usePathname } from 'next/navigation';

export const GlobalNavigation: React.FC = () => {
    const pathname = usePathname();

    const isHockeyActive = pathname.includes(hockeyRoutes.home);
    const isWheelActive = pathname.includes(wheelRoutes.home);

    return (
        <nav className={styles.container}>
            <Link
                href={hockeyRoutes.home}
                className={`${styles.link} ${isHockeyActive ? styles.active : ''}`}
            >
                <IconStick isActive={isHockeyActive} />
                <p>Хоккей</p>
            </Link>
            <Link href={wheelRoutes.home} className={`${styles.link} ${isWheelActive ? styles.active : ''}`}>
                <IconWheel isActive={isWheelActive} />
                <p>Колесо</p>
            </Link>
        </nav>
    );
};
