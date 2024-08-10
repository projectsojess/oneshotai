import * as z from 'zod';

export const EditImageSchema = z.object({
    image:z.instanceof(File, {message:"Image file is required"}),
    mask:z.instanceof(File).optional(),
    growMask: z.string().optional(),
    negativePrompt : z.string().max(10000, {message:"Maximum 10000 characters are allowed"}).optional(),
    prompt: z.string().max(10000, {message:"Maximum 10000 characters are allowed"}).optional(),
    left: z.string().optional(),
    right: z.string().optional(),
    up: z.string().optional(),
    down: z.string().optional(),
    creativity: z.string().optional(),
    searchPrompt: z.string().max(10000, {message:"Maximum 10000 characters are allowed"}).optional(),
    model: z.string().min(1, { message: "Please select a model" }),
  }).refine( (data) => {

    if(data.model === 'sd-edit-inpaint' || data.model === 'sd-edit-sr') {
       
      return data.prompt &&  data.prompt.length > 10;
    }
    return true;
  }, { message: "Prompt is required",path: ['prompt']})

  .refine( (data) => {

    if( data.model === 'sd-edit-sr') {

      return data.searchPrompt &&  data.searchPrompt.length > 10;
    }

    return true;
  },{ message: "Search Prompt is required", path: ['searchPrompt']})
  .refine( (data) => {

    const growMask = Number.parseInt(data.growMask);

    if(growMask) {

      if(data.model === 'sd-edit-inpaint'){

          return growMask >=0 && growMask <=100;
      }
      if(data.model === 'sd-edit-sr' || data.model === 'sd-edit-erase'){
        return growMask >=0 && growMask <=20;
      }

    }
    return true;
  }, {message: 'Enter a valid value', path: ['growMask']})
  .refine( (data) => {
    const left = Number.parseInt(data.left);
    if(left) {
      if(data.model === 'sd-edit-outpaint'){

        return left >=0 && left <=2000;
      }
    }
    return true;
  }, {message: 'Value should be between 0 and 2000', path: ['left']})
  .refine( (data) => {
    const right = Number.parseInt(data.right);
    if(right) {
      if(data.model === 'sd-edit-outpaint'){

        return right >=0 && right <=2000;
      }
    }
    return true;
  }, {message: 'Value should be between 0 and 2000', path: ['right']})
  .refine( (data) => {
    const up = Number.parseInt(data.up);
    if(up) {
      if(data.model === 'sd-edit-outpaint'){

        return up >=0 && up <=2000;
      }
    }
    return true;
  }, {message: 'Value should be between 0 and 2000', path: ['up']})
  .refine( (data) => {
    const down = Number.parseInt(data.down);
    if(down) {
      if(data.model === 'sd-edit-sr'){

        return down >=0 && down <=2000;
      }
    }
    return true;
  }, {message: 'Value should be between 0 and 2000', path: ['down']})
  .refine( (data) => {
    const creativity = Number.parseInt(data.creativity);
    if(creativity) {
      if(data.model === 'sd-edit-sr'){

        return creativity >=0 && creativity <=1;
      }
    }
    return true;
  }, {message: 'Value should be between 0 and 1', path: ['creativity']});