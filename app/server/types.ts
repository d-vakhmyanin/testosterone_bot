import { User } from 'telegraf/types';

import { Bet } from '../utils/hockey/matches';

type Month = number;
type UserId = number;
type Day = number;
export type UserTrainsData = Record<Day, { is_right_time: boolean }>;

type MonthData = Record<Month, Record<UserId, UserTrainsData> & { shame?: User[] }>;

export type ChatData = Partial<{ participants: User[] } & MonthData>;

export type BetsData = Record<string, Bet>;
