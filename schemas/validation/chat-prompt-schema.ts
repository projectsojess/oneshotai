import * as z from 'zod';

export const ChatPromptSchema = z.object({
    prompt: z.string().min(5, {
        message: "Please enter a valid prompt"
    }),
});