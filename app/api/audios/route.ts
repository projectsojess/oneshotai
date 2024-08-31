import { INTERNAL_SERVER_ERROR_MESSAGE, INVALID_REQUEST } from "@/constants/error-messages";
import { getUserServer } from "@/hooks/use-current-user";
import { logger } from "@/logger/logger";
import { getAvailableStorage, updateUserStorage } from "@/utils/credit-utils";
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
        const fileSizeInBytes = buffer.length;

        const availableStorage = await getAvailableStorage();
        if(availableStorage < fileSizeInBytes){
    
          return NextResponse.json({
            message: 'Unable to save image. Not enough storage.'
          }, { status: 401 });
        }
        
        const filename = `AUDIO_${new Date()}.mp3`;
        const path = `${user.id}/AUDIOS/${filename}`;

        const { error: saveError } = await supabase.storage
        .from('onestopai-bucket') 
        .upload(path, buffer, {
            contentType: 'audio/mpeg',
            upsert: false
        });

        if(saveError){

            return NextResponse.json({
                message: 'Unable to save audio. Please try again in some time.'
            }, {status:500});
        }
    
        const { data: urlData } = await supabase.storage
                                .from('onestopai-bucket')
                                .getPublicUrl(path);

        const { data, error } = await supabase.from("user_files")
                                .insert({
                                    type:'AUDIO',
                                    filename:filename,
                                    project_id:projectId,
                                    chat_id:chatId,
                                    size_bytes: fileSizeInBytes,
                                    public_url: urlData.publicUrl
                                }).select();
        if(error){
            return NextResponse.json({
                message: 'Unable to save audio. Please try again in some time.'
            }, {status:500});
        }


    const newAvailableStorage = availableStorage - fileSizeInBytes;

    await updateUserStorage(newAvailableStorage,fileSizeInBytes);
    
        return NextResponse.json({
            message: 'Saved Audio Successfully'
        }, {status:200});
 
    } catch (error) {
        console.log(error);
        logger.error("Error saving audio")
        return NextResponse.json({
            message: INTERNAL_SERVER_ERROR_MESSAGE
        }, {status:500});
    }
}