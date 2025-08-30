import { Exercise } from '@/app/(front)/context';
import { apiRoutes } from '@/app/(front)/utils/routes';

export type ShortUser = {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
};

export type SendWheelMessageRequest = {
    chatId?: string;
    isJoke: boolean;
    user?: ShortUser;
    data: { exercise?: Exercise };
};

export type SendWheelMessageResponse = Response;

export const sendWheelMessage = (body: SendWheelMessageRequest): Promise<SendWheelMessageResponse> =>
    fetch(apiRoutes.sendWheelMessage, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
