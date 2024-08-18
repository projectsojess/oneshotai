
import { logger } from "@/logger/logger";
import { isToday } from "@/utils/date-time-formatter";
import { getPayPalAccessToken, getSubscription, verifySignature } from "@/utils/paypal";
import createAdmin from "@/utils/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
      const headers = request.headers;
      const event = await request.text();
        const data = JSON.parse(event);

    const isSignatureValid = await verifySignature(event, headers);
  
      if (isSignatureValid) {
        
        const { event_type} = data;

        switch(event_type){
            case 'BILLING.SUBSCRIPTION.CREATED':
                const resp = await handleSubscriptionCreated(data.resource);
                if(resp?.error){
                    logger.error(`error saving to db e: ${resp?.error.message}`);
                    return NextResponse.json({ status: 'error', message: 'Internal server error' }, { status: 500 });
                }
                break
            case 'PAYMENT.SALE.COMPLETED':
                const subscriptionId = data.resource.billing_agreement_id;
                if(subscriptionId){
                    const resp = await handlePaymentSaleCompleteForSubscription(data.resource);
                    if(!resp){
                        return NextResponse.json({ status: 'error', message: 'Internal server error' }, { status: 500 });
                    }
                    if(resp?.error){
                        logger.error( `Error in webhook handlePaymentSaleCompleteForSubscription() e: ${resp?.error.message}`)
                        return NextResponse.json({ status: 'error', message: 'Internal server error' }, { status: 500 });
                    }
                }
                break
            case 'BILLING.SUBSCRIPTION.CANCELLED':
                await handleSubscriptionCancelled(data.resource)
                break
            // case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED':
            //     await handlePaymentFailed(data.resource)
            //     break
        }

        
        return NextResponse.json({ status: 'success' }, { status: 200 });
      } else {
        console.log(`Signature is not valid for ${data?.id} ${headers.get('correlation-id')}`);
        // Reject processing the webhook event
        return NextResponse.json({ status: 'invalid signature' }, { status: 400 });
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
      return NextResponse.json({ status: 'error', message: 'Internal server error' }, { status: 500 });
    }
  }

  async function handleSubscriptionCreated(resource) {

    try {
        const supabase = createAdmin();
        const { custom_id, start_time, plan_id, status, id } = resource;
        const dbResp = await supabase.from("user_subscriptions")
                                    .insert({
                                        user_id: custom_id,
                                        status,
                                        start_date: start_time,
                                        plan_id,
                                        id
                                    });
        return dbResp;
    } catch (error) {
        logger.error("error saving subscription to db")
        return null;
    }
  }
  async function handlePaymentSaleCompleteForSubscription(resource) {
    const { billing_agreement_id: subscriptionId} = resource;
    try {
        const accessToken = await getPayPalAccessToken();

        if(!accessToken){
            logger.error("no access token generated in webhook handlePaymentSaleCompleteForSubscription()");
            return null;
        }

        const { custom_id, start_time, plan_id, status, id , billing_info} = await getSubscription(subscriptionId,accessToken);
        
        const supabase = createAdmin();
        const { data, error } = await supabase.from('plans')
        .select('*').eq('paypal_plan_id',plan_id);

        if(error){
            logger.error("error fetching plans for webhook handlePaymentSaleCompleteForSubscription()");
            return null;
        }
        const plan = data[0];

        const { next_billing_time: endDate } = billing_info;
        const resp = await supabase.from("user_subscriptions")
        .upsert({
            user_id: custom_id,
            status,
            start_date: start_time,
            end_date: endDate,
            plan_id,
            id
        });
        if(resp.error){
            logger.error(" error updating user _subscriptions in webhook handlePaymentSaleCompleteForSubscription()")
        }
        if(!isToday(start_time)){
            if(plan){

                const { data, error } = await supabase.from('user_plans')
                                        .select('available_credits,available_storage,total_credits,total_storage')
                                        .eq('user_id',custom_id);
    
                if(data){
    
                    const {available_credits, total_credits,total_storage, available_storage } = data[0]
                    const resp = await supabase.from("user_plans")
                    .update({
                        plan: plan.plan,
                        status,
                        total_credits: total_credits + plan.total_credits,
                        available_credits: available_credits + plan.total_credits,
                        total_storage: total_storage + plan.total_storage,
                        available_storage: available_storage + plan.total_storage,
                        expiry_date: endDate,
                        subscription_id: subscriptionId
    
                    }).eq('user_id', custom_id);
                    return resp;
                }else {
    
                    const resp = await supabase.from("user_plans")
                    .update({
                        user_id: custom_id,
                        plan: plan.plan,
                        status,
                        total_credits: plan.total_credits,
                        available_credits: plan.total_credits,
                        total_storage: plan.total_storage,
                        available_storage: plan.total_storage,
                        expiry_date: endDate,
                        subscription_id: subscriptionId
    
                    }).eq('user_id', custom_id);
                    
                    return resp;
                }
    
            }else {
                logger.error(`no plan data found for plan id: ${plan_id} in webhook handlePaymentSaleCompleteForSubscription()`)
                return null;
            }
        }else {
            return resp;
        }
       
    } catch (error) {
        logger.error("error saving subscription to db")
        return null;
    }
  }


  async function handleSubscriptionCancelled(resource) {

    try {
        const supabase = createAdmin();
        const { custom_id, status, id } = resource;
        const dbResp = await supabase.from("user_subscriptions")
                                    .update({
                                        status,
                                    }).eq('id', id);

        const updatePlanResp = await supabase.from("user_plans")
                                    .update({
                                        status
                                    }).eq("user_id",custom_id);
        return updatePlanResp;
    } catch (error) {
        logger.error("error saving subscription to db")
        return null;
    }
  }