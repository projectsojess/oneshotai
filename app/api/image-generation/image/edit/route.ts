
import { INTERNAL_SERVER_ERROR_MESSAGE, INVALID_DATA } from "@/constants/error-messages";
import { STABLE_DIFFUSION_ENDPOINTS } from "@/constants/server-constants";
import { getUserPlanServer } from "@/hooks/use-current-user";
import { imageData } from "@/mocks/mock-data";
import { EditImageSchema } from "@/schemas/validation/edit-image-schema";
import { getCostFormModel, updateUserCredits } from "@/utils/credit-utils";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

interface PayloadValues {
    image: File,
    mask?: File,
    prompt? : string,
    searchPrompt? : string, 
    growMask? : number, 
    negativePrompt? : string, 
    model:string,
    left? : number,
    right? : number,
    up?: number,
    down? : number,
    creativity ? : number
}

export async function  PUT(request: NextRequest) {
    
    try {
        
        

        var imgBase64s : {
            id?: string,
            base64: string,
        }[] = [];
        const formData = await request.formData();
        const image = formData.get('image') as File;
        const mask = formData.get('mask') as File;
        const valuesBlob = formData.get('values') as Blob;

        const valuesString = await valuesBlob.text();
        const values = JSON.parse(valuesString);
        const allValues = {...values, image}
        const validatedFields = EditImageSchema.safeParse(allValues);

        if(!validatedFields.success){

            return NextResponse.json( {
                message: INVALID_DATA
            },{status: 400});
        }

        const { 
            prompt,
            searchPrompt, 
            growMask, 
            negativePrompt, 
            model,
            left,
            right,
            up,
            down,
            creativity
         } = validatedFields.data;

         const cost = await getCostFormModel(model);

        const { available_credits } = await getUserPlanServer();

        if(available_credits < cost){

            return NextResponse.json({
                message: 'Limit exceeded'
            }, {status:403})
        }


        if(process.env.NODE_ENV === 'production') {

            const bearer = `Bearer ${process.env.STABLE_DIFFUSION_API_KEY}`;
            const url = STABLE_DIFFUSION_ENDPOINTS[model as keyof typeof STABLE_DIFFUSION_ENDPOINTS];

            const payload = createPayloadForStableDiffusion(
                {
                image,
                mask,
                model,
                prompt,
                searchPrompt,
                negativePrompt,
                growMask: Number.parseInt(growMask),
                left : Number.parseInt(left),
                right : Number.parseInt(right),
                up : Number.parseInt(up),
                down : Number.parseInt(down),
                creativity: Number.parseInt(creativity)
                }
            );

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
    
              imgBase64s = [{
                id:'',
                base64: response.data.image
              }];

        }else {
            imgBase64s = imageData;
        }
        
        const newAvailableCredits = available_credits - cost;
        updateUserCredits(newAvailableCredits,cost);
        
        return NextResponse.json({
            urls:  imgBase64s,
        }, {status:200});

    } catch (error) {
        console.error("error",error);
        return NextResponse.json({
            message: INTERNAL_SERVER_ERROR_MESSAGE
        }, {status:500});
    }
}

 function createPayloadForStableDiffusion ({
    image,
    mask,
    growMask,
    prompt,
    negativePrompt,
    searchPrompt,
    model,
    left,
    right,
    up,
    down,
    creativity


 }: PayloadValues) {

    var payload = {};

    if(model === 'sd-edit-erase') {

        payload = {
            image: image,
        }

        if(mask) payload = {...payload,mask};
        if(growMask) payload = {...payload,growMask};
    }

    if( model === 'sd-edit-inpaint') {

        payload = {
            image: image,
            prompt : prompt,                    
        }
        if(mask) payload = {...payload,mask};
        if(growMask) payload = {...payload,growMask};

        if(negativePrompt) payload = {...payload,negativePrompt};
    }

    if(model === 'sd-edit-outpaint'){

        payload = {
            image: image
        }
        if(left) payload = {...payload,left};
        if(right) payload = {...payload,right};
        if(up) payload = {...payload,up};
        if(down) payload = {...payload,down};
        if(prompt) payload = {...payload,prompt};
        if(creativity) payload = {...payload,creativity}; 

    }

    if(model === 'sd-edit-sr'){

        payload = {
            image: image,
            prompt:prompt,
            search_prompt: searchPrompt,
        }

        if(negativePrompt) payload = {...payload,negativePrompt};
        if(growMask) payload = {...payload,growMask};
    }

    if(model === 'sd-edit-rm-bg'){

        payload = {
            image
        }
    }

    return payload;
}