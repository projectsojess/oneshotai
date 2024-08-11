import { INTERNAL_SERVER_ERROR_MESSAGE, INVALID_REQUEST } from "@/constants/error-messages";
import { logger } from "@/logger/logger";
import { createServer } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: any) {

    try {
        const { params } = context;
        const { projectId } = params;
        
        const supabase = createServer();

        if(!projectId){

            return NextResponse.json({
                message: INVALID_REQUEST
            }, {status:400})
        }
        const { data, error } = await supabase.from('chats')
                                .select('id,created_at,title,description,icon')
                                .eq("project_id", projectId).limit(3);

        if(error){
            logger.error(`Error fetching all chats e: ${error.message}`)
            return NextResponse.json({
                message: INTERNAL_SERVER_ERROR_MESSAGE,
            },{status:500});
        }
        return NextResponse.json({
            chats: data
        },{status:200});
    } catch (error) {
        
        logger.error("Error Fetching recent chats")
        return NextResponse.json({
            message: INTERNAL_SERVER_ERROR_MESSAGE
        }, {status:500});
    }
}