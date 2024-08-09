import { SD_IMAGE_MODELS } from '@/constants/app-constants';
import * as z from 'zod';

export const ImagePromptSchema = z.object({
    prompt: z.string().min(10, {
      message: "Please enter a valid prompt",
    }),
    negativePrompt: z.string().max(10000, {message:"Maximum 10000 characters allowed"}).optional(),
    model: z.string().min(1, { message: "Please select a model" }),
    variations: z.string().min(1, { message: "Please select a valid number" }),
    resolution: z.string().min(1, { message: "Please select a resolution" }),
  }).refine( (data) => {

    if(data.model  === 'dall-e-2') {
        if(data.prompt.trim().length > 1000){
            return false;
        }
    }
    return true;
  }, { message: 'Maximum characters for Dall E 2 model is 1000', path:['prompt']})
  .refine( (data) => {

    if(data.model === 'dall-e-3') {

      if(data.prompt.trim().length> 4000){
          return false;
      }
  }
  return true;
  },{ message: "Maximum character allowed for Dall-E 3 models is 4000",path:['prompt']})
  .refine( (data) => {
    if (SD_IMAGE_MODELS.includes(data.model)) {
      if(data.prompt.trim().length >10000) {
        return false;
      }
    }
    return true;
  }, { message : 'Maximum characters allowed for Stable diffusion models is 10000 characters',path:['prompt']});