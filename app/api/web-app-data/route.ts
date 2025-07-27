import { getBotInstance } from '@/app/server';
import { getUsernameTag } from '@/app/server/utils/getUsername';
import { NextRequest, NextResponse } from 'next/server';

const tunnel = process.env.TUNNEL_URL?.replace(/:\d+/, '');
const ALLOWED_DOMAINS = [tunnel];

export const POST = async (req: NextRequest) => {
    try {
        const origin = req.headers.get('origin');

        if (!origin || !ALLOWED_DOMAINS.includes(origin)) {
            return new NextResponse('Forbidden', { status: 403 });
        }

        const { chatId, user, data } = await req.json();

        if (!chatId || !user || !data || !data?.segment?.name) {
            return new NextResponse('Wrong Request', { status: 400 });
        }

        const bot = getBotInstance();

        const res = await bot.telegram.sendMessage(
            chatId,
            `✨${getUsernameTag(user)}!✨\n\n<b>Ты пидор!</b>\n\n🎰(так сказало колесо)🎰`,
            {
                parse_mode: 'HTML',
            }
        );

        await bot.telegram.sendMessage(chatId, `Ладно, на самом деле, колесо сказало: ${data.segment.name}`, {
            reply_parameters: {
                message_id: res.message_id,
            },
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};
