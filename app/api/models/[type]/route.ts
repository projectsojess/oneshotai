import { INTERNAL_SERVER_ERROR_MESSAGE, INVALID_REQUEST } from "@/constants/error-messages";
import { logger } from "@/logger/logger";
import { createServer } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";


const fetchAIModels = unstable_cache(
    async (type: string,supabase: SupabaseClient) => {
        const { data, error } = await supabase.from("ai_models")
            .select('name,value,icon,type')
            .eq("type", type);

        if (error) {
            logger.error(`Error in fetching ai models from supabase e: ${error.message}`);
            return null;
        }

        return data;
    },
    ['ai-models'],  // cache key prefix
    { revalidate: 86400, tags: ['ai-models'] }  // cache options, 86400 seconds = 1 day
);


export async function GET(request: NextRequest, context: any) {

    try {
        const { params } = context;
        const { type } = params;

        if(!type){
            return NextResponse.json({
                message:INVALID_REQUEST
            }, {status:400})
        }
        const supabase = createServer();
        const data = await fetchAIModels(type,supabase);

        if(!data){

            return NextResponse.json({
                message: INTERNAL_SERVER_ERROR_MESSAGE
            }, { status: 500 });
        }
        return NextResponse.json({
            models: data
        }, { status: 200 });

    } catch (error) {
        console.log(error);
        logger.error("Error fetching models")
        return NextResponse.json({
            message: INTERNAL_SERVER_ERROR_MESSAGE
        }, {status:500});
    }
}