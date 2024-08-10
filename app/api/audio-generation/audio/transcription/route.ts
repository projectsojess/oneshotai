
import { INTERNAL_SERVER_ERROR_MESSAGE } from "@/constants/error-messages";
import { textData } from "@/mocks/mock-data";
import { checkUserLimit } from "@/utils/check-limit";
import { createServer } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();



export async function POST(request: NextRequest, res:NextResponse){

    try {
        
        const formData = await request.formData();
        const audioFile = formData.get('file') as File;
        const prompt = formData.get('prompt') as string || '';
        const language = formData.get('language') as string || 'en';

        if (!audioFile) {
            return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
          }

          const supabase = createServer();

          const proceed = checkUserLimit('whisper-1');
  
          if(!proceed){
  
              return NextResponse.json({
                  message: 'Limit exceeded'
              }, {status:403})
          }
        // const transcriptionResp = await openai.audio.transcriptions.create({
        //     prompt: prompt,
        //     language: language,
        //     file: audioFile,
        //     model: "whisper-1",
        //   });
          
        //   const { text } = transcriptionResp;

          return NextResponse.json( {
            text: textData
          }, {status:200});
    } catch (error) {
        console.log(error);
        return NextResponse.json( {
            message: INTERNAL_SERVER_ERROR_MESSAGE
        }, {status:500});
    }
}