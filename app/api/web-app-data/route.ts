import { NextRequest, NextResponse } from 'next/server';
import { getBotInstance } from '@/app/server';
import { getUsernameTag } from '@/app/server/utils/getUsername';
import { RequestBody } from '@/app/utils/request';

const tunnel = process.env.TUNNEL_URL?.replace(/:\d+/, '');
const ALLOWED_DOMAINS = [tunnel];

export const POST = async (req: NextRequest) => {
    try {
        const origin = req.headers.get('origin');

        if (!origin || !ALLOWED_DOMAINS.includes(origin)) {
            return new NextResponse('Forbidden', { status: 403 });
        }

        const { chatId, user, data, isJoke } = (await req.json()) as RequestBody;

        if (!user || !data?.exercise?.name) {
            return new NextResponse('Bad Request', { status: 400 });
        }

        const bot = getBotInstance();

        if (isJoke && chatId) {
            const message = `✨${getUsernameTag(user)}!✨\n\n<b>Ты пидор!</b>\n\n🎰(так сказало колесо)🎰`;
            await bot.telegram.sendMessage(chatId, message, { parse_mode: 'HTML' });
        } else {
            const message = `<b>🎰Колесо сказало: 🎰</b>\n${data?.exercise?.name}`;
            await bot.telegram.sendMessage(user.id, message, { parse_mode: 'HTML' });
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};
