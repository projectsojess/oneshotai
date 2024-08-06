import { unstable_cache } from "next/cache";
import { createServer } from "./supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { logger } from "@/logger/logger";
import { getUserPlanServer } from "@/hooks/use-current-user";

export const checkUserLimit = async (model: string) =>{


    const supabase = createServer();
    const cost = fetchCostData(model,supabase);
    if(!cost){
        throw new Error("Cost is not defined")
    }

    const { availableCredits } = await getUserPlanServer();
    
    if(!availableCredits){
        throw new Error("Available Credits is not defined")
    }
    return cost < availableCredits;
}

const fetchCostData = unstable_cache(
    async (model: string,supabase: SupabaseClient) => {

        const { data, error } = await supabase.from("ai_models")
            .select('credits_per_request')
            .eq("value", model);

        if (error) {
            logger.error(`Error in fetching ai models from supabase e: ${error.message}`);
            return null;
        }

        return data[0];
    },
    ['ai-models-model'],  // cache key prefix
    { revalidate: 86400, tags: ['ai-models-model'] }  // cache options, 86400 seconds = 1 day
);