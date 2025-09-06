import React from 'react';

import styles from './Button.module.css';

import { Sentinel } from '../MatchesList/Sentinel';

type ButtonProps = {
    onClick: () => void;
    view?: 'blue' | 'red';
    className?: string;
    isLoading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<React.PropsWithChildren<ButtonProps>> = ({
    className,
    view = 'blue',
    onClick,
    children,
    disabled,
    isLoading = false,
    ...rest
}) => {
    return (
        <button
            {...rest}
            disabled={disabled || isLoading}
            onClick={onClick}
            className={`${styles.base} ${view === 'blue' ? styles.blue : styles.red} ${
                className ? className : ''
            }`}
        >
            {isLoading ? <Sentinel isHidden={false} className={styles.sentinel} /> : children}
        </button>
    );
};
