import { NextRequest, NextResponse } from 'next/server';

import { SaveBetRequest } from '@/app/utils/requests/saveBet';
import { loadBetsData, saveBetsData } from '@/app/server/utils/fs';

const tunnel = process.env.TUNNEL_URL?.replace(/:\d+/, '');
const ALLOWED_DOMAINS = [tunnel];

export const POST = async (req: NextRequest) => {
    try {
        const origin = req.headers.get('origin');

        if (!origin || !ALLOWED_DOMAINS.includes(origin)) {
            return new NextResponse('Forbidden', { status: 403 });
        }

        const { user, bet, matchId }: SaveBetRequest = await req.json();

        if (!user || !bet || !matchId) {
            return new NextResponse('Bad Request', { status: 400 });
        }

        const data = loadBetsData(user.id);

        data[matchId] = bet;

        saveBetsData(user.id, data);

        return NextResponse.json({ ok: true, bet });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};
