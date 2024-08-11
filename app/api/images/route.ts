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

        if(!projectId && !chatId){

            return NextResponse.json({
                message: INVALID_REQUEST
            }, {status:400})
        }
        const buffer = Buffer.from(base64,'base64');

        const filenameDb = `${title}_IMAGE_${new Date()}.png`;

        const { data, error } = await supabase.from("user_files")
                                .insert({
                                    type:'IMAGE',
                                    filename:filenameDb,
                                    project_id:projectId,
                                    chat_id:chatId
                                }).select();
        if(error){

            return NextResponse.json({
                message: 'Unable to save image. Please try again in some time.'
            }, {status:500});
        }
        const id = data[0].id;
        if(id){

            const fileNameS3 = `${id}.png`;
            const path = projectId && chatId ? `${user.id}/${projectId}/${chatId}/IMAGES/${fileNameS3}` 
            : projectId && !chatId ? `${user.id}/${projectId}/IMAGES/${fileNameS3}`: `${user.id}/${chatId}/IMAGES/${fileNameS3}` ;
    
            const { data, error } = await supabase.storage
                                    .from('onestopai-bucket') 
                                    .upload(path, buffer, {
                                        contentType: 'image/png',
                                        upsert: false
                                    });
            if(error){
                return NextResponse.json({
                    message: 'Unable to save image. Please try again in some time.'
                }, {status:500});
            }

            return NextResponse.json({
                message: 'Saved image Successfully'
            }, {status:200});
        }else {

            return NextResponse.json({
                message: 'Unable to save image. Please try again in some time.'
            }, {status:500});
        }
    } catch (error) {
        console.log(error);
        logger.error("Error saving image")
        return NextResponse.json({
            message: INTERNAL_SERVER_ERROR_MESSAGE
        }, {status:500});
    }
}