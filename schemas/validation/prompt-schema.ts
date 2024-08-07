import * as z from 'zod';
export const PromptSchema = z.object({
    prompt: z.string().min(5, {
        message: "Please enter a valid prompt"
    }),
    model: z.string().min(1, { message: "Please select a model" }),
    title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});