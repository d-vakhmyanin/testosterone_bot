import React from 'react';

import styles from './Label.module.css';

type LabelProps = {
    text: string;
    secondary?: boolean;
} & React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label: React.FC<React.PropsWithChildren<LabelProps>> = ({
    text,
    secondary,
    children,
    ...rest
}) => {
    return (
        <label className={`${styles.label} ${secondary ? styles.secondary : ''}`} {...rest}>
            {text}
            {children}
        </label>
    );
};
