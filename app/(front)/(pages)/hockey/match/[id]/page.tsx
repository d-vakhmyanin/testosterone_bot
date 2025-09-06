import React from 'react';
import { BackButton } from '@/app/(front)/components/BackButton/BackButton';
import { MathPage } from '@/app/(front)/components/MatchPage/MatchPage';
import { loadMatches } from '@/app/server/utils/fs';

type MatchProps = {
    params: Promise<{ id: string }>;
};

const Page: React.FC<MatchProps> = async ({ params }) => {
    const { id } = await params;
    const matches = loadMatches();

    const match = matches.find((m) => m.id === id);

    if (!match) {
        return null;
    }

    return (
        <>
            <BackButton />
            <MathPage {...match} />
        </>
    );
};

export default Page;
