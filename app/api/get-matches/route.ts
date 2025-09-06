import { NextRequest, NextResponse } from 'next/server';

import { getMatchesServer } from './getMatchesServer';

export const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);

        const type = searchParams.get('type') as Parameters<typeof getMatchesServer>[0]['type'];
        const edgeMatchId = searchParams.get('edgeMatchId') || undefined;
        const minLimit = Number(searchParams.get('minLimit')) || undefined;

        const res = await getMatchesServer({ edgeMatchId, type, minLimit });

        return NextResponse.json({ ok: true, ...res });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};
