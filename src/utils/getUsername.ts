import { User } from 'telegraf/typings/core/types/typegram';

export const getUsername = (user: User) => `${user.first_name} ${user.last_name}`;
