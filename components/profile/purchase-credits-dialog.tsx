import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
  import { Label } from "@/components/ui/label";
import { useState } from "react";
import PayPalPaymentButton from "../payments/paypal-payment-button";
import { PlusCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import axios from "axios";
import toast from "react-hot-toast";
import { INTERNAL_SERVER_ERROR_MESSAGE } from "@/constants/error-messages";

const PurchaseCreditsDialog = ({userId, plan} : {userId: string, plan: string}) => {
    const [selectedAmount, setSelectedAmount] = useState('10');
    const [customAmount, setCustomAmount] = useState('');
    
    const handleAmountChange = (value) => {
        setSelectedAmount(value);
        if (value !== 'custom') {
          setCustomAmount('');
        }
      };
    
      const handleCustomAmountChange = (e) => {
        setCustomAmount(e.target.value);
      };

      const handlePaymentSuccess = async (details) => {
        
        try {
            const { id } = details;
            const resp = await axios.post("/api/orders", {
                orderId: id,
                product: 'CREDITS'
            });
            toast.success(resp.data?.message);
        } catch (error) {

            toast.error(error.response?.data?.message || INTERNAL_SERVER_ERROR_MESSAGE)
        }
      };
  return (
    <Dialog >
      <DialogTrigger asChild>

        <Button
            size="sm"
            className="ml-auto"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Buy
            {plan === 'FREE' && (
              <Badge variant='secondary' className='ml-2'>PRO</Badge>
            )}
          </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Purchase Credits</DialogTitle>
          <DialogDescription>
            Choose an amount or enter a custom value to purchase credits.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto max-h-[80vh]">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 h-full">
            <div className="w-full sm:w-1/2">
              <RadioGroup value={selectedAmount} onValueChange={handleAmountChange}>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="10" id="option-10" />
                  <Label htmlFor="option-10">$10</Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="20" id="option-20" />
                  <Label htmlFor="option-20">$20</Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="custom" id="option-custom" />
                  <Label htmlFor="option-custom">Custom</Label>
                </div>
              </RadioGroup>
              {selectedAmount === 'custom' && (
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  className="mt-2"
                />
              )}
            </div>
            <div className="w-full sm:w-1/2">
              <PayPalPaymentButton
                amount={selectedAmount === 'custom' ? customAmount : selectedAmount}
                onSuccess={handlePaymentSuccess}
                userId={userId}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PurchaseCreditsDialog
