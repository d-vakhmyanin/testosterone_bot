'use client';
import React from 'react';
import { usePathname } from 'next/navigation';

import styles from './PageTitle.module.css';
import { wheelRoutes } from '../../utils/routes';

type WheelRoute = (typeof wheelRoutes)[keyof typeof wheelRoutes];

const pathnameToTitleMap: Record<WheelRoute, string> = {
    '/wheel': 'Колесо',
    '/wheel/exercises': 'Упражнения',
    '/wheel/settings': 'Настройки',
};

export const PageTitle: React.FC = () => {
    const pathName = usePathname();

    const title = pathName in pathnameToTitleMap ? pathnameToTitleMap[pathName as WheelRoute] : '';

    if (!title) {
        return null;
    }

    return <h1 className={styles.title}>{title}</h1>;
};
