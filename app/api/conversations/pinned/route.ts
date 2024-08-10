import { INTERNAL_SERVER_ERROR_MESSAGE, INVALID_REQUEST } from "@/constants/error-messages";
import { logger } from "@/logger/logger";
import { createServer } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    try {
        const { searchParams } = new URL(request.url);

        const chatId = searchParams.get("chatId");

        if(!chatId ){

            return NextResponse.json({
                message: INVALID_REQUEST
            }, {status:400})
        }

        const supabase = createServer();

        const { data, error } = await supabase.from("chat_messages")
                                .select("id,chat_pinned,project_pinned, content, model")
                                .eq("chat_id", chatId).eq('chat_pinned',true);
        if(error){

            return NextResponse.json({
                message: INTERNAL_SERVER_ERROR_MESSAGE,
            },{status:500});
        }

        const pinnedData = data.map( (item) => ({
            ...item,
            type:'message'
        }));

        return NextResponse.json({
            pinnedItems: pinnedData,
        },{status:200});
    } catch (error) {
        
        logger.error("Error fetching pinned messages")
        return NextResponse.json({
            message: INTERNAL_SERVER_ERROR_MESSAGE
        }, {status:500});
    }
}

export async function PUT(request: NextRequest) {


    try {
        const { messageId, project, chat } = await request.json();

        if(!messageId){

            return NextResponse.json({
                message: INVALID_REQUEST
            }, {status:400})
        }

        const supabase = createServer();

        const { data, error } = await supabase.from("chat_messages")
        .update({
            project_pinned: project,
            chat_pinned: chat
        }).eq("id",messageId).select('id,content,model,project_pinned,chat_pinned');

        if(error){

            return NextResponse.json({
                message: "Unable to update pinned message. Please try again later"
            }, {status:500});
        }
        const pinnedItem = {
            ...data[0],
            type:"message"
        }
        return NextResponse.json({
            pinnedItem
        },{status:200});
    } catch (error) {
        
        logger.error("Error updating pinned messages")
        return NextResponse.json({
            message: INTERNAL_SERVER_ERROR_MESSAGE
        }, {status:500});
    }
}