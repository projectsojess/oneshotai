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
    
    const plan: Plan = {
        plan: data[0].plan,
        status: data[0].status,
        total_credits: data[0].total_credits,
        total_storage: data[0].total_storage,
        available_storage: data[0].available_storage,
        available_credits: data[0].purchased_credits + data[0].plan_credits,
        expiry_date: data[0].expiry_date
    };

    return plan;
}