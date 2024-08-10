import { INTERNAL_SERVER_ERROR_MESSAGE, INVALID_REQUEST } from "@/constants/error-messages";
import { logger } from "@/logger/logger";
import { createServer } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: any) {

    try {
        const { params } = context;
        const { chatId } = params;

        if(!chatId){

            return NextResponse.json({
                message:INVALID_REQUEST
            }, {status:400})
        }

        const supabase = createServer();

        const { data, error } = await supabase.from("chat_messages")
                                    .select('id,role,content,model,project_id,project_pinned,chat_pinned')
                                    .eq("chat_id",chatId).order('created_at');
        if(error){
            logger.error(`Error getting chats e: ${error.message}`)
                return NextResponse.json({
                    message: "Unable to find chats. Please try again later."
                }, {status:500});
        }
        return NextResponse.json({
            messages: data
        },{status:200});
    }catch(error){

        logger.error("Error fetching chats")
        return NextResponse.json({
            message: INTERNAL_SERVER_ERROR_MESSAGE
        }, {status:500});
    }

}