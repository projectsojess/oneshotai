import * as z from 'zod';

export const TranscriptionSchema = z.object({
    file: z.instanceof(File, {message:"Audio file is required"}),
    language: z.string().min(1, "Please select a language"),
    prompt: z.string().max(200, "Maximum of 200 characters allowed").optional()
  });