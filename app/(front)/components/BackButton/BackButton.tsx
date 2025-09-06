'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import styles from './BackButton.module.css';

export const BackButton: React.FC = () => {
    const router = useRouter();

    const handleClick = () => {
        router.back();
    };

    return (
        <button className={styles.backButton} onClick={handleClick} aria-label="Назад">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                    d="M15 18L9 12L15 6"
                    stroke="var(--accent-color)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            Назад
        </button>
    );
};
