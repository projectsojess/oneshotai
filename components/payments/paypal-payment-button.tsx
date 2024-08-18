'use client'
import { appData } from "@/constants/app-data";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

const initialOptions = {
  clientId: appData.paypalClientId,
  currency: "USD",
  intent: "capture"
};

export default function PayPalPaymentButton({ amount, onSuccess, userId }) {

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
        reference_id:userId,
          amount: {
            value: amount,
          },
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING"
      }
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      const name = details.payer.name.given_name;
      console.log(details)
      onSuccess(details);
    });
  };

  const onError = (err) => {
    onError(err);
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        style={{
          shape: 'rect',
          color: 'blue',
          layout: 'vertical',
          label: 'pay'
        }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
      />
    </PayPalScriptProvider>
  );
}