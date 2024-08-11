import { Plan } from "@/types/plan";
import { createServer } from "@/utils/supabase/server";



export const getUserServer = async () => {

    const supabase = createServer();
    const { data, error} = await supabase.auth.getUser();
    return data?.user;
}

export const getUserPlanServer =async (): Promise<Plan> => {

    const supabase = createServer();
    const user = await getUserServer();
    const { data, error } = await supabase.from('user_plans')
                                    .select("*")
                                    .eq("user_id",user.id)
    
    const plan: Plan = data[0];

    return plan;
}