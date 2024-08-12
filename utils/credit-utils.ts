import { unstable_cache } from "next/cache";
import { createServer } from "./supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { logger } from "@/logger/logger";
import createAdmin from "./supabase/admin";
import { getUserServer } from "@/hooks/use-current-user";

export const getCostFormModel = async (model: string):Promise<number> =>{


    const supabase = createServer();
    const cost = await fetchCostData(model,supabase);
    
    return cost;
}

const fetchCostData = unstable_cache(
    async (model: string,supabase: SupabaseClient): Promise<number | null> => {

        const { data, error } = await supabase.from("ai_models")
            .select('credits_per_request')
            .eq("value", model);

        if (error) {
            logger.error(`Error in fetching ai models from supabase e: ${error.message}`);
            return null;
        }

        return data[0]?.credits_per_request ?? null;;
    },
    ['ai-models-model'],  // cache key prefix
    { revalidate: 86400, tags: ['ai-models-model'] }  // cache options, 86400 seconds = 1 day
);

export const updateUserCredits = async (newAvailableCredits:number, cost:number) => {
    const user = await getUserServer();
    try {
        const supabase = createAdmin();

        if(!user){
            logger.error(`unable to update user credits empty user found`)
        }
        const { data, error } = await supabase.from("user_plans")
                                        .update({
                                            available_credits: newAvailableCredits
                                        }).eq("user_id", user.id);
        
        if(error){

            logger.error(`unable to update user credits for user: ${user.id} for cost: ${cost}`);
        }
        

    } catch (error) {
        logger.error(`unable to update user credits for user: ${user.id} for cost: ${cost}`);
    }
}