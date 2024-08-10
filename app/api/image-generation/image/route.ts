
import { OPEN_AI_IMAGE_MODELS, RESOLUTIONS_ASPECT_MAP, SD_IMAGE_MODELS } from "@/constants/app-constants";
import { INTERNAL_SERVER_ERROR_MESSAGE } from "@/constants/error-messages";
import { STABLE_DIFFUSION_ENDPOINTS } from "@/constants/server-constants";
import { logger } from "@/logger/logger";
import { imageData } from "@/mocks/mock-data";
import { checkUserLimit } from "@/utils/check-limit";
import { createServer } from "@/utils/supabase/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

import { OpenAI} from 'openai';

const openai = new OpenAI();

interface StableDiffusionData {
    model : string,
    prompt : string,
    resolution: string,
    negativePrompt?: string,
    image? : File
}

export async function  POST(request: NextRequest) {
    
    try {

        const body = await request.json();
        const {model, prompt, variations, size } = body;

        var imgBase64s : {
            id?: string,
            base64: string
        }[] = [];
        const supabase = createServer();

        const proceed = checkUserLimit(model);

        if(!proceed){

            return NextResponse.json({
                message: 'Limit exceeded'
            }, {status:403})
        }
        
        if(process.env.NODE_ENV === 'production') {
            if(OPEN_AI_IMAGE_MODELS.includes(model)){

                const imageResp = await openai.images.generate({
                    model: model,
                    prompt: prompt,
                    response_format: 'b64_json',
                    n: (Number.parseInt(variations) ? Number.parseInt(variations) : 1),
                    size: size
                });
    
                const { data } = imageResp;
    
                data.forEach( (image) => {
    
                    if(image.b64_json) imgBase64s = [...imgBase64s, {
                        id:'',
                        base64: image.b64_json
                    }];
                })
            }if (SD_IMAGE_MODELS.includes(model)) {
    
                const data = await generateImageWithStableDiffusionModels(
                    {
                    model,
                    prompt,
                    resolution:size,
                });
    
                imgBase64s = [...imgBase64s, {
                    id:'',
                    base64: data
                }];
            }
        }else {
            imgBase64s = imageData;
        }
        
        return NextResponse.json({
            imageData: imgBase64s,
            model: model
        }, {status:200});

    } catch (error) {
        logger.error("error",error);
        return NextResponse.json({
            message: INTERNAL_SERVER_ERROR_MESSAGE
        }, {status:500});
    }
}


const  generateImageWithStableDiffusionModels = async ({
    model,
    prompt,
    resolution,
    negativePrompt,
    image
     } : StableDiffusionData) => {

        const bearer = `Bearer ${process.env.STABLE_DIFFUSION_API_KEY}`;
    try {
        const url = STABLE_DIFFUSION_ENDPOINTS[model as keyof typeof STABLE_DIFFUSION_ENDPOINTS];
        const aspectRatio = RESOLUTIONS_ASPECT_MAP[resolution as keyof typeof RESOLUTIONS_ASPECT_MAP];

        var payload = {};
        if(model.startsWith('sd3')){
            payload = {
                prompt: prompt,
                aspect_ratio: aspectRatio,
                negative_prompt: negativePrompt,
                image: image,
                output_format: 'png'
            }
        }else {
             payload = {
                prompt: prompt,
                aspect_ratio: aspectRatio,
                negative_prompt: negativePrompt,
                output_format: 'png'
            }
        }
        console.debug("payload", payload);

        const response = await axios.postForm(
            url,
            axios.toFormData(payload, new FormData()),
            {
              validateStatus: undefined,
              headers: { 
                Authorization: bearer, 
                Accept: "application/json" 
              },
            },
          );

          return response.data.image;
          
    } catch (error) {
         throw error;
    }
}