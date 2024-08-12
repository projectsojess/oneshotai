import { INTERNAL_SERVER_ERROR_MESSAGE, INVALID_REQUEST } from "@/constants/error-messages";
import { getUserServer } from "@/hooks/use-current-user";
import { logger } from "@/logger/logger";
import { createServer } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest, context: any) {
    
    try {
        const { params } = context;
        const { projectId } = params;

        
        if(!projectId){

            return NextResponse.json({
                message: INVALID_REQUEST
            }, {status:400})
        }

        const supabase = createServer();
        
        const user = await getUserServer();

        const { data, error } = await supabase.from("user_files")
                                      .select('type,filename,project_id,id,public_url,size_bytes, created_at')
                                      .eq("project_id",projectId);
        if(error){

          return NextResponse.json({
            message: INTERNAL_SERVER_ERROR_MESSAGE
        }, {status:500});
        }

        return NextResponse.json({
          files: data
      }, {status:200});
    } catch (error) {
        
        logger.error("Error Fetching all files for project")
        return NextResponse.json({
            message: INTERNAL_SERVER_ERROR_MESSAGE
        }, {status:500});
    }
}

