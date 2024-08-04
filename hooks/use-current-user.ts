import { createServer } from "@/utils/supabase/server";



export const getUserServer = async () => {

    const supabase = createServer();
    const { data, error} = await supabase.auth.getUser();
    return data?.user;
}

export const getUserPlanServer = async () => {

    const supabase = createServer();
    const { data, error} = await supabase.auth.getUser();
    return data?.user.user_metadata?.plan;
}