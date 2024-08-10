import * as z from 'zod';


export const TranslationSchema = z.object({
    file: z.instanceof(File, {message:"Audio file is required"}),
    prompt: z.string().max(200, "Maximum of 200 characters allowed").optional()
  });