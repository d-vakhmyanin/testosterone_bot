import React from 'react';

import { useTgStartParams } from '../../hooks/useTgStartParams';
import { Button } from '../Button/Button';

type SendButtonProps = {
    onClick: (params: Record<string, string>) => void;
};

export const SendButton: React.FC<SendButtonProps> = ({ onClick }) => {
    const { params } = useTgStartParams();

    const handleClick = React.useCallback(() => {
        onClick(params);
    }, [onClick, params]);

    return (
        <Button onClick={handleClick} view="red">
            Это очень необычная кнопка.
            <br />
            Интересно, что она делает?
        </Button>
    );
};
