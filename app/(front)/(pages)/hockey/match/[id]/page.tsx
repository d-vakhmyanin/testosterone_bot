import React from 'react';
import { BackButton } from '@/app/(front)/components/BackButton/BackButton';
import { MathPage } from '@/app/(front)/components/MatchPage/MatchPage';
import { getMatchById } from '@/app/server/utils/getMatchById';

type MatchProps = {
    params: Promise<{ id: string }>;
};

const Page: React.FC<MatchProps> = async ({ params }) => {
    const { id } = await params;
    const { match, details, nextMatchId } = await getMatchById(id);

    if (!match) {
        return (
            <>
                <BackButton />
                <div>Матч не найден</div>
            </>
        );
    }

    return (
        <>
            <BackButton />
            <MathPage match={match} nextMatchId={nextMatchId} details={details} />
        </>
    );
};

export default Page;
