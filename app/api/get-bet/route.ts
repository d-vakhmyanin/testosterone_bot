import { loadBetsData } from '@/app/server/utils/fs';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);

        const matchId = searchParams.get('matchId');
        const userId = searchParams.get('userId');

        if (!matchId || !userId) {
            return new NextResponse('Bad request', { status: 400 });
        }

        const data = loadBetsData(Number(userId));
        const bet = data[matchId];

        if (!bet) {
            return new NextResponse('Not Found', { status: 404 });
        }

        return NextResponse.json({ ok: true, bet });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};
