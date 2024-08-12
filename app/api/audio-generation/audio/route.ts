
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from 'fs';
import path from 'path';
import OpenAI from "openai";
import { createServer } from "@/utils/supabase/server";
import { INTERNAL_SERVER_ERROR_MESSAGE } from "@/constants/error-messages";
import { getCostFormModel, updateUserCredits } from "@/utils/credit-utils";
import { getUserPlanServer } from "@/hooks/use-current-user";

const openai = new OpenAI();



export async function POST(request: NextRequest, res:NextResponse){

    try {
        let audioBuffer ;
        const { prompt, model, voice }= await request.json();


        const cost = await getCostFormModel(model);

        const { available_credits } = await getUserPlanServer();

        if(available_credits < cost){

            return NextResponse.json({
                message: 'Limit exceeded'
            }, {status:403})
        }

         if(process.env.NODE_ENV === 'production'){

            const audio = await openai.audio.speech.create({
                model:model,
                voice:voice,
                input:prompt
            });
            audioBuffer = await audio.arrayBuffer();

         }else {


            const audioFilePath = path.join(process.cwd(), 'public', 'audio', 'response.mp3');
            audioBuffer = await fs.readFile(audioFilePath);
         }


        const newAvailableCredits = available_credits - cost;
        updateUserCredits(newAvailableCredits,cost);
        // Read the file

        const response = new NextResponse(audioBuffer);

        response.headers.set('Content-Type', 'audio/mpeg');
        response.headers.set('Content-Length', audioBuffer.byteLength.toString());
        
        return response;

    } catch (error) {
        
        return NextResponse.json( {
            message: INTERNAL_SERVER_ERROR_MESSAGE
        }, {status:500});
    }
}