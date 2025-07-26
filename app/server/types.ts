import { User } from 'telegraf/types';

type Month = number;
type UserId = number;
type Day = number;
export type UserTrainsData = Record<Day, { is_right_time: boolean }>;

type MonthData = Record<Month, Record<UserId, UserTrainsData> & { shame?: User[] }>;

export type ChatData = Partial<{ participants: User[] } & MonthData>;
