
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from 'fs';
import path from 'path';
import OpenAI from "openai";
import { createServer } from "@/utils/supabase/server";
import { checkUserLimit } from "@/utils/check-limit";
import { INTERNAL_SERVER_ERROR_MESSAGE } from "@/constants/error-messages";

const openai = new OpenAI();



export async function POST(request: NextRequest, res:NextResponse){

    try {
        
        const { prompt, model, voice }= await request.json();

        const supabase = createServer();

        const proceed = checkUserLimit(model);

        if(!proceed){

            return NextResponse.json({
                message: 'Limit exceeded'
            }, {status:403})
        }

        //  const audio = await openai.audio.speech.create({
        //                     model:model,
        //                     voice:voice,
        //                     input:prompt
        //                 });
        // const audioBuffer = await audio.arrayBuffer();

        const audioFilePath = path.join(process.cwd(), 'public', 'audio', 'response.mp3');

    // Read the file
    const audioBuffer = await fs.readFile(audioFilePath);

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