import {z} from 'zod';

export const Schema = z.object({
    identifier: z.string(),
    password: z.string()
}) 