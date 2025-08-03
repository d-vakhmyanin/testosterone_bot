import React from 'react';

import styles from './Button.module.css';

type ButtonProps = {
    onClick: () => void;
    view?: 'blue' | 'red';
    className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<React.PropsWithChildren<ButtonProps>> = ({
    className,
    view = 'blue',
    onClick,
    children,
    ...rest
}) => {
    return (
        <button
            {...rest}
            onClick={onClick}
            className={`${styles.base} ${view === 'blue' ? styles.blue : styles.red} ${
                className ? className : ''
            }`}
        >
            {children}
        </button>
    );
};
