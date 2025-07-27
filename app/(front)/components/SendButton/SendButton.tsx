import React from 'react';

import styles from './SendButton.module.css';

import { useTgStartParams } from '../../hooks.ts/useTgStartParams';

type SendButtonProps = {
    onClick: (params: Record<string, string>) => void;
};

export const SendButton: React.FC<SendButtonProps> = ({ onClick }) => {
    const { params } = useTgStartParams();

    const handleClick = React.useCallback(() => {
        onClick(params);
    }, [onClick, params]);

    return (
        <button className={styles.sendButton} onClick={handleClick}>
            Это очень необычная кнопка.
            <br />
            Интересно, что она делает?
        </button>
    );
};
