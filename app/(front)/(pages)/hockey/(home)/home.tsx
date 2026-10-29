'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { MatchesList } from '@/app/(front)/components/MatchesList/MatchesList';
import { useMatches } from '@/app/(front)/context';
import { Spinner } from '@/app/(front)/components/Spinner/Spinner';

export const Home: React.FC = () => {
    const { state, loadTop, loadBottom, loadFilteredMatches } = useMatches();
    const searchParams = useSearchParams();

    useEffect(() => {
        loadFilteredMatches();
    }, [searchParams, loadFilteredMatches]);

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
