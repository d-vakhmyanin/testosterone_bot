'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

type MatchProps = {
    params: React.Usable<{ id: string }>;
};

const Match: React.FC<MatchProps> = ({ params }) => {
    const router = useRouter();
    const { id } = React.use(params);

    return (
        <div>
            <button onClick={router.back}>back</button>
            <h1>MATCH</h1>
            <div>id: {id}</div>
        </div>
    );
};

export default Match;
