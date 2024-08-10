import { INTERNAL_SERVER_ERROR_MESSAGE, INVALID_REQUEST } from "@/constants/error-messages";
import { getUserServer } from "@/hooks/use-current-user";
import { logger } from "@/logger/logger";
import { createServer } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    try {
        const user = await getUserServer();
        const supabase = createServer();
        if(!user){
            return NextResponse.json({
                message: INVALID_REQUEST
            }, {status:400})
        }

        const { base64, projectId, chatId } = await request.json();
        const buffer = Buffer.from(base64,'base64');

        const filenameDb = `AUDIO_${new Date()}.mp3`;

        const { data, error } = await supabase.from("user_files")
                                .insert({
                                    type:'AUDIO',
                                    filename:filenameDb,
                                    project_id:projectId,
                                    chat_id:chatId
                                }).select();
        if(error){

            return NextResponse.json({
                message: 'Unable to save audio. Please try again in some time.'
            }, {status:500});
        }
        const id = data[0].id;
        if(id){

            const fileNameS3 = `${id}.mp3`;
            const path = `${user.id}/AUDIOS/${fileNameS3}`;
    
            const { data, error } = await supabase.storage
                                    .from('onestopai-bucket') 
                                    .upload(path, buffer, {
                                        contentType: 'audio/mpeg',
                                        upsert: false
                                    });
            if(error){
                return NextResponse.json({
                    message: 'Unable to save audio. Please try again in some time.'
                }, {status:500});
            }

            return NextResponse.json({
                message: 'Saved Audio Successfully'
            }, {status:200});
        }else {

            return NextResponse.json({
                message: 'Unable to save audio. Please try again in some time.'
            }, {status:500});
        }
    } catch (error) {
        console.log(error);
        logger.error("Error saving audio")
        return NextResponse.json({
            message: INTERNAL_SERVER_ERROR_MESSAGE
        }, {status:500});
    }
}