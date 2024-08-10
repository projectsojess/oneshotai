import { SD_IMAGE_MODELS } from '@/constants/app-constants';
import * as z from 'zod';

export const ImageUpscaleSchema = z.object({
    image:z.instanceof(File, {message:"Image file is required"}),
    prompt: z.string().min(10, {
      message: "Please enter a valid prompt",
    }),
    negativePrompt: z.string().max(10000, {message:"Maximum 10000 characters allowed"}).optional(),
    creativity: z.string().optional(),
    model: z.string().min(1, { message: "Please select a model" }),
  }).refine( (data) => {

    if(SD_IMAGE_MODELS.includes(data.model)) {
        if(data.prompt.trim().length > 10000){
            return false;
        }
    }
    return true;
  }, { message: 'Maximum characters for Stable diffusion models is 10000 characters', path:['prompt']})
  .refine( (data) => {
    const creativity = Number.parseInt(data.creativity)
    if(creativity){
      if(data.model === 'sd-img-up-cons'){
        return creativity >= 0.2 && creativity <=0.5;
      }
    }
    return true;
  }, {message:"Creativity value should be between 0.2 and 0.5", path: ['creativity']})
  .refine( (data) => {

    const creativity = Number.parseInt(data.creativity)
    
    if(creativity) {
      if(data.model === 'sd-img-up-cr') {
        return creativity >=0 && creativity <=0.35;
      }
    }
    return true;
  }, {message:"Creativity value should be between 0 and 0.35", path: ['creativity']})