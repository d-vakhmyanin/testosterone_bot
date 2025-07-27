import { NextRequest, NextResponse } from 'next/server';
import { getBotInstance } from '@/app/server';

export const POST = async (req: NextRequest) => {
    if (req.headers.get('x-telegram-bot-api-secret-token') !== process.env.TG_WEBHOOK_SECRET) {
        return new NextResponse('Forbidden', { status: 403 });
    }

    try {
        const body = await req.json();
        const bot = getBotInstance();

        await bot.handleUpdate(body);

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const dynamic = 'force-dynamic'; // Отключаем кэширование
