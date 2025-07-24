import { User } from 'telegraf/types';

export const getUsername = (user: User) => `${user.first_name}${user.last_name ? ` ${user.last_name}` : ''}`;

export const getUsernameTag = (user: User) => (user.username ? `@${user.username}` : getUsername(user));
