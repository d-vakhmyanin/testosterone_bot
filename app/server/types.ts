import { Context, Telegraf } from 'telegraf';
import { Update, User } from 'telegraf/types';

export type Bot = Telegraf<Context<Update>>;

type Month = number;
type UserId = number;
type Day = number;
export type UserTrainsData = Record<Day, { is_right_time: boolean }>;

type MonthData = Record<Month, Record<UserId, UserTrainsData> & { shame?: User[] }>;

export type ChatData = Partial<{ participants: User[] } & MonthData>;
