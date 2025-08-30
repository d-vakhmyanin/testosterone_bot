import React from 'react';
import Link from 'next/link';

type MatchProps = {
    params: Promise<{ id: string }>;
};

const Match: React.FC<MatchProps> = async ({ params }) => {
    const { id } = await params;

    return (
        <div>
            <Link href="/">back</Link>
            <h1>MATCH</h1>
            <div>id: {id}</div>
        </div>
    );
};

export default Match;
