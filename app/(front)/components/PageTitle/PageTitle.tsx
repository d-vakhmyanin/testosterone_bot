'use client';
import React from 'react';
import { usePathname } from 'next/navigation';

import styles from './PageTitle.module.css';

const pathnameToTitleMap: Record<string, string> = {
    '/': 'Колесо',
    '/exercises': 'Упражнения',
    '/settings': 'Настройки',
};

export const PageTitle: React.FC = () => {
    const pathName = usePathname();

    const title = pathnameToTitleMap[pathName];

    if (!title) {
        return null;
    }

    return <h1 className={styles.title}>{title}</h1>;
};
