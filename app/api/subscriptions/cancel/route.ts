import { INTERNAL_SERVER_ERROR_MESSAGE } from "@/constants/error-messages";
import { getUserServer } from "@/hooks/use-current-user";
import { cancelSubscription, getPayPalAccessToken } from "@/utils/paypal";
import { createServer } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    try {
        const { reason } = await request.json();

        const supabase = createServer();
        const user = await getUserServer();
        const  {data, error} = await supabase.from('user_plans')
                                .select('id')
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
        const { id } = data[0];

        const resp = await cancelSubscription(id,accessToken,reason);

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
                                            }).eq("id",id);

        if(subUpdaterror){

            return NextResponse.json({
                message: INTERNAL_SERVER_ERROR_MESSAGE
            }, {status:500});
        }
        return NextResponse.json({
            message: 'Subscription Cancelled successfully'
        }, { status : 200});

    } catch (error) {
        
        return NextResponse.json({
            message: INTERNAL_SERVER_ERROR_MESSAGE
        }, {status:500});
    }
}