import React, { useEffect } from 'react';
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import axios from 'axios';
import toast from 'react-hot-toast';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '@/constants/error-messages';
import { appData } from '@/constants/app-data';


const initialOptions = {
    clientId: appData.paypalClientId,
    vault: true,
    intent: "subscription"
  };

export default function PayPalSubscriptionButton({planId, productId, userId}:{planId:string, productId: string, userId: string}) {

  const handleSubscriptionSuccess = async(subscriptionId: string) => {

    try {
      const resp = await axios.post("/api/subscriptions",{
        subscriptionId,
        productId
      });
    } catch (error) {
      toast.error(error.response?.data?.message || INTERNAL_SERVER_ERROR_MESSAGE)
    }
  }

  return (
    <PayPalScriptProvider options={initialOptions}>
    <PayPalButtons
      style={{
        shape: 'rect',
        color: 'blue',
        layout: 'vertical',
        label: 'subscribe'
      }}
      createSubscription={(data, actions) => {
        return actions.subscription.create({
          plan_id: planId,
          custom_id: userId
        });
      }}
      onApprove={(data, actions) => {
        return actions.subscription.get().then((details) => {
          return handleSubscriptionSuccess(details.id);
        });
      }}
    />
  </PayPalScriptProvider>
  );
}