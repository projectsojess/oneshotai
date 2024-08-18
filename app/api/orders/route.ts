import { creditsPerUSD } from "@/constants/app-constants";
import { INTERNAL_SERVER_ERROR_MESSAGE } from "@/constants/error-messages";
import { getUserServer } from "@/hooks/use-current-user";
import { logger } from "@/logger/logger";
import { getOrderDetails, getPayPalAccessToken } from "@/utils/paypal";
import createAdmin from "@/utils/supabase/admin";
import { createServer } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    
    try {
        const { orderId, product } = await request.json();

        const accessToken = await getPayPalAccessToken();


        const orderDetails = await getOrderDetails(orderId,accessToken);

        if(!orderDetails){
            logger.error(`Error getting order details:  ${orderId}`)
            return NextResponse.json({
                message: INTERNAL_SERVER_ERROR_MESSAGE
            }, {status:500});
        }
        const { status, purchase_units } = orderDetails;

        const { reference_id, amount} = purchase_units[0];

        const { currency_code, value } = amount;

        const supabase = createServer();

        const user = await getUserServer();

        if(reference_id !== user.id){

            logger.error(`User id and reference id miss match userId: ${user.id} referenceId: ${reference_id}`)
            return NextResponse.json({
                message: INTERNAL_SERVER_ERROR_MESSAGE
            }, {status:500});
        }

        const { data, error } = await supabase.from("user_orders")
                                .insert({
                                    id: orderId,
                                    currency: currency_code,
                                    amount: value,
                                    product,
                                    status
                                });

        if(error){
            logger.error(`Error creating order details e:${error.message} for order id: ${orderId}`)
            return NextResponse.json({
                message: error.message
            }, {status:500});
        }

        const creditsAllocated = creditsPerUSD * parseInt(value);

        const supabaseAdmin = createAdmin();

        const { data:planData, error:planError} = await supabaseAdmin.from("user_plans")
                                                    .select('available_credits,total_credits').eq("user_id",user.id);

        if(planError){
            logger.error(`Error fetcing plan details e:${planError.message} for order id: ${orderId}`)
            return NextResponse.json({
                message: INTERNAL_SERVER_ERROR_MESSAGE
            }, {status:500});
        }

        const { available_credits, total_credits } = planData[0];

        const { error:updateError} = await supabaseAdmin.from("user_plans")
                                        .update({
                                            available_credits: available_credits + creditsAllocated,
                                            total_credits: total_credits + creditsAllocated
                                        }).eq("user_id", user.id);
        if(updateError){

            logger.error(`Error updating plan details e:${updateError.message} for order id: ${orderId}`)
            return NextResponse.json({
                message: INTERNAL_SERVER_ERROR_MESSAGE
            }, {status:500});
        }
        
        return NextResponse.json({
            message: 'Credits updated successfully'
        }, {status:200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: INTERNAL_SERVER_ERROR_MESSAGE
        }, {status:500});

    }
}