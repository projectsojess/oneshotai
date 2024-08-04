import { createClient } from "@/utils/supabase/client";




export const getUserClient = async () => {

    const supabase = createClient();
    const { data, error} = await supabase.auth.getUser();
    return data?.user;
}

export const getUserPlanClient = async () => {

    const supabase = createClient();
    const { data, error} = await supabase.auth.getUser();
    return data?.user?.user_metadata?.plan;
}