
import { INTERNAL_SERVER_ERROR_MESSAGE, INVALID_DATA } from "@/constants/error-messages";
import { STABLE_DIFFUSION_ENDPOINTS } from "@/constants/server-constants";
import { imageData } from "@/mocks/mock-data";
import { ImageUpscaleSchema } from "@/schemas/validation/image-upscale-schema";
import { checkUserLimit } from "@/utils/check-limit";
import { createServer } from "@/utils/supabase/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";




export async function  PUT(request: NextRequest) {
    

    try{

        

        var imgBase64s : string[] = [];
        const formData = await request.formData();
        const image = formData.get('image') as File;

        const valuesBlob = formData.get('values') as Blob;
        const valuesString = await valuesBlob.text();
        const values = JSON.parse(valuesString);
        const allValues = {...values, image}
        const validatedFields = ImageUpscaleSchema.safeParse(allValues);

        if(!validatedFields.success){

            return NextResponse.json( {
                message: INVALID_DATA
            },{status: 400});
        }

        const { prompt,negativePrompt, model,creativity } = validatedFields.data;

        const supabase = createServer();

        const proceed = checkUserLimit(model);

        if(!proceed){

            return NextResponse.json({
                message: 'Limit exceeded'
            }, {status:403})
        }

        if(process.env.NODE_ENV === 'production') {

            const bearer = `Bearer ${process.env.STABLE_DIFFUSION_API_KEY}`;
            const url = STABLE_DIFFUSION_ENDPOINTS[model as keyof typeof STABLE_DIFFUSION_ENDPOINTS];

            const payload = {
                image,
                prompt,
                negativePrompt,
                creativity: Number.parseInt(creativity)
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
    
              imgBase64s = [response.data.image];
        }else {
            imgBase64s = imageData;
        }

        
        return NextResponse.json({
            urls:  imgBase64s,
        }, {status:200});
    }catch(err) {
        console.error("error",err);
        return NextResponse.json({
            message: INTERNAL_SERVER_ERROR_MESSAGE
        }, {status:500});
    }
}