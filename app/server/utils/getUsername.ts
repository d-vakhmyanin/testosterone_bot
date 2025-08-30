import { ShortUser } from '@/app/utils/requests/sendWheelMessage';

export const getUsername = (user: ShortUser) =>
    `${user.first_name}${user.last_name ? ` ${user.last_name}` : ''}`;

export const getUsernameTag = (user: ShortUser) => (user.username ? `@${user.username}` : getUsername(user));
