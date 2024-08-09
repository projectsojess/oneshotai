import * as z from 'zod';

export const AudioPromptSchema = z.object({
    prompt: z.string().min(1, "Prompt is required").max(4096,"Maximum allowed characters is 4096"),
    model: z.string(),
    voice: z.string()
  });