'use client';

import React from 'react';
import { MatchesList } from '@/app/(front)/components/MatchesList/MatchesList';
import { useMatches } from '@/app/(front)/context';
import { Spinner } from '@/app/(front)/components/Spinner/Spinner';

export const Home: React.FC = () => {
    const { state, loadTop, loadBottom } = useMatches();

    if (state.isGlobalLoading) {
        return <Spinner />;
    }

    return (
        <MatchesList
            data={state.matches}
            isLoading={state.isLoading}
            hasMoreBottom={state.hasNext}
            hasMoreTop={state.hasPrev}
            loadMoreBottom={loadBottom}
            loadMoreTop={loadTop}
        />
    );
};
