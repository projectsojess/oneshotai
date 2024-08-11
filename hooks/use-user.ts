import { Plan } from "@/types/plan";
import { createClient } from "@/utils/supabase/client";



export const getUserClient = async () => {

    const supabase = createClient();
    const { data, error} = await supabase.auth.getUser();
    return data?.user;
}

export const getUserPlanClient =async () : Promise<Plan> => {

    const supabase = createClient();
    const user = await getUserClient();
    const { data, error } = await supabase.from('user_plans')
                                    .select("*")
                                    .eq("user_id",user.id)
    const plan: Plan = data[0];
    return plan;
}