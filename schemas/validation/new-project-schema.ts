import * as z from 'zod';

//Login form validations with password validations

export const NewProjectSchema = z.object({
    name: z.string().min(2, {message:"Please enter a valid project name"}),
    description:z.string().min(2, {message:"Please enter a valid project description"}).max(1000, "Description must not exceed 1000 characters"),
});
