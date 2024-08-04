import * as z from 'zod';

//Login form validations with password validations

export const LoginSchema = z.object({
    email: z.string().email(),
    password:z.string(),
});
