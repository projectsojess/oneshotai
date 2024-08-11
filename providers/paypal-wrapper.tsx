import { appData } from "@/constants/app-data";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const PayPalWrapper = ({ children }) => {
  return (
    <PayPalScriptProvider options={{clientId: appData.paypalClientId, vault:true}}>
      {children}
    </PayPalScriptProvider>
  );
};

export default PayPalWrapper;