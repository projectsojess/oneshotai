import { INTERNAL_SERVER_ERROR_MESSAGE, INVALID_REQUEST } from "@/constants/error-messages";
import { logger } from "@/logger/logger";
import { createServer } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest, context: any) {

    try {
        const { params } = context;
        const { projectId } = params;
        
        if(!projectId){

            return NextResponse.json({
                message:INVALID_REQUEST
            }, {status:400})
        }

        const supabase = createServer();

        const { data, error } = await supabase.from("projects")
                                .select('*')
                                .eq("id", projectId);
        if(error){
            return NextResponse.json({
                message: error.message,
            },{status:400})
        }

        const project = data[0];

        return NextResponse.json({
            project,
        },{status:200})
    } catch (error) {
        logger.error("Error fetching project")
        return NextResponse.json({
            message: INTERNAL_SERVER_ERROR_MESSAGE
        }, {status:500});
    }
}