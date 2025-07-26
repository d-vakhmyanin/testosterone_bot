import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/types';
import { Telegram } from '@twa-dev/types';

declare global {
    type Bot = Telegraf<Context<Update>>;

    interface Window {
        Telegram: Telegram;
    }
}

export {}; // Важно для модульной системы
