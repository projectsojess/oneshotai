import { INTERNAL_SERVER_ERROR_MESSAGE, INVALID_REQUEST } from "@/constants/error-messages";
import { getUserServer } from "@/hooks/use-current-user";
import { logger } from "@/logger/logger";
import { isToday } from "@/utils/date-time-formatter";
import { getPayPalAccessToken, getSubscription } from "@/utils/paypal";
import createAdmin from "@/utils/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    try {
        const supabase = createAdmin();
        const user = await getUserServer();
        const {subscriptionId } = await request.json();
        
        const accessToken = await getPayPalAccessToken();

        if(accessToken){

            const { status, plan_id, start_time,billing_info} = await getSubscription(subscriptionId,accessToken);
            const { next_billing_time: endDate } = billing_info;

            if(!isToday(start_time)) return NextResponse.json({
                message: INVALID_REQUEST
                }, {status:400})

            if(!plan_id){

                return NextResponse.json({
                message: INVALID_REQUEST
                }, {status:400})
            }

            if(status ==='ACTIVE'){
                const { data, error } = await supabase.from('plans')
                .select('*').eq('paypal_plan_id',plan_id);

                if(error){
                    return NextResponse.json({
                        message: INTERNAL_SERVER_ERROR_MESSAGE
                        }, {status:500})
                }
                const plan = data[0];

                if(plan){

                    const { data, error } = await supabase.from("user_subscriptions")
                                .upsert({
                                    user_id: user.id,
                                    plan_id: plan.paypal_plan_id,
                                    status,
                                    start_date: start_time,
                                    end_date: endDate,
                                    id:subscriptionId
                                });

                    if(error){
                        console.log(error);
                        return NextResponse.json({
                            message: INTERNAL_SERVER_ERROR_MESSAGE
                            }, {status:500})
                    }

                   const resp = await supabase.from("user_plans")
                                    .upsert({
                                        user_id: user.id,
                                        plan: plan.plan,
                                        status,
                                        total_credits: plan.total_credits,
                                        available_credits: plan.total_credits,
                                        total_storage: plan.total_storage,
                                        available_storage: plan.total_storage,
                                        expiry_date: endDate
                                    });
                                    
                    if(resp.error){
                        return NextResponse.json({
                            message: INTERNAL_SERVER_ERROR_MESSAGE
                        }, {status:500});
                    }

                }else {
                    return NextResponse.json({
                        message: INVALID_REQUEST
                        }, {status:400})
                }
            }else {

                return NextResponse.json({
                    message: 'Payment Failed. Please try again'
                }, {status:400});
            }
        }
        return NextResponse.json({

        },{status:200})
    } catch (error) {
        
        logger.error(`Error verifying subscription`);
        return NextResponse.json({
            message: INTERNAL_SERVER_ERROR_MESSAGE
        }, {status:500});

    }   
}
