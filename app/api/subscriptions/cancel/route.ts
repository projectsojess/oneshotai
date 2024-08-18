import { INTERNAL_SERVER_ERROR_MESSAGE } from "@/constants/error-messages";
import { getUserServer } from "@/hooks/use-current-user";
import { cancelSubscription, getPayPalAccessToken } from "@/utils/paypal";
import createAdmin from "@/utils/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    try {
        const { reason } = await request.json();

        const supabase = createAdmin();
        const user = await getUserServer();
        const  {data, error} = await supabase.from('user_plans')
                                .select('subscription_id')
                                .eq('user_id',user.id);

        if(error){

            return NextResponse.json({
                message: INTERNAL_SERVER_ERROR_MESSAGE
            }, {status:500});
        }

        const accessToken = await getPayPalAccessToken();

        if(!accessToken){

            return NextResponse.json({
                message: INTERNAL_SERVER_ERROR_MESSAGE
            }, {status:500});
        }
        const { subscription_id } = data[0];

        const resp = await cancelSubscription(subscription_id,accessToken,reason);

        const { error: planUpdateError }  = await supabase.from("user_plans")
                                            .update({
                                                status: 'CANCELLED'
                                            }).eq('user_id',user.id);
        
        if(planUpdateError){
            return NextResponse.json({
                message: INTERNAL_SERVER_ERROR_MESSAGE
            }, {status:500});
        }

        const { error: subUpdaterror } = await supabase.from("user_subscriptions")
                                            .update({
                                                status: 'CANCELLED'
                                            }).eq("id",subscription_id);

        if(subUpdaterror){

            return NextResponse.json({
                message: INTERNAL_SERVER_ERROR_MESSAGE
            }, {status:500});
        }
        return NextResponse.json({
            message: 'Subscription Cancelled successfully'
        }, { status : 200});

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: INTERNAL_SERVER_ERROR_MESSAGE
        }, {status:500});
    }
}