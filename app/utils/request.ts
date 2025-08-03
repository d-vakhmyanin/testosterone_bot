import { Exercise } from '../(front)/context';

export type ShortUser = {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
};

export type RequestBody = {
    chatId?: string;
    isJoke: boolean;
    user?: ShortUser;
    data: { exercise?: Exercise };
};
