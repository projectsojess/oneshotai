
import { INTERNAL_SERVER_ERROR_MESSAGE } from "@/constants/error-messages";
import { getUserPlanServer } from "@/hooks/use-current-user";
import { textData } from "@/mocks/mock-data";
import { getCostFormModel, updateUserCredits } from "@/utils/credit-utils";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();



export async function POST(request: NextRequest, res:NextResponse){

    try {
        
        const formData = await request.formData();
        const audioFile = formData.get('file') as File;
        const prompt = formData.get('prompt') as string || '';
        const language = formData.get('language') as string || 'en';
        let textOut = textData;
        if (!audioFile) {
            return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
          }


          const cost = await getCostFormModel('whisper-1');

          const { available_credits } = await getUserPlanServer();
  
          if(available_credits < cost){
  
              return NextResponse.json({
                  message: 'Limit exceeded'
              }, {status:403})
          }
          
          if(process.env.NODE_ENV === 'production'){

            const transcriptionResp = await openai.audio.transcriptions.create({
                prompt: prompt,
                language: language,
                file: audioFile,
                model: "whisper-1",
              });
              
              const { text } = transcriptionResp;
              textOut = text;
          }

          const newAvailableCredits = available_credits - cost;
          updateUserCredits(newAvailableCredits,cost);

          return NextResponse.json( {
            text: textOut
          }, {status:200});


    } catch (error) {
        console.log(error);
        return NextResponse.json( {
            message: INTERNAL_SERVER_ERROR_MESSAGE
        }, {status:500});
    }
}