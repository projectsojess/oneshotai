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

        const { base64, projectId, chatId, title } = await request.json();

        const buffer = Buffer.from(base64,'base64');
        const fileSizeInBytes = buffer.length;

        const filename = `${title}_IMAGE_${new Date()}.png`;

        const path = `${user.id}/IMAGES/${filename}`;


        const { error: saveError } = await supabase.storage
        .from('onestopai-bucket') 
        .upload(path, buffer, {
            contentType: 'image/png',
            upsert: false
        });

        if(saveError){

            return NextResponse.json({
                message: 'Unable to save image. Please try again in some time.'
            }, {status:500});

        }
        
        const { data: urlData } = await supabase.storage
                                .from('onestopai-bucket')
                                .getPublicUrl(path);

        
        const { data, error } = await supabase.from("user_files")
                                .insert({
                                    type:'IMAGE',
                                    filename:filename,
                                    project_id:projectId,
                                    chat_id:chatId,
                                    public_url: urlData.publicUrl,
                                    size_bytes: fileSizeInBytes
                                }).select();
        if(error){
            return NextResponse.json({
                message: 'Unable to save image. Please try again in some time.'
            }, {status:500});
        }

        return NextResponse.json({
            message: 'Saved image Successfully'
        }, {status:200});
    } catch (error) {
        logger.error("Error saving image")
        return NextResponse.json({
            message: INTERNAL_SERVER_ERROR_MESSAGE
        }, {status:500});
    }
}