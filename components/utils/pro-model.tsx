import { useProModal } from "@/hooks/use-pro-modal"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Zap, CheckIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import PayPalSubscriptionButton from "../payments/paypal-subscription-button";
import { cn } from "@/lib/utils";
import { appData } from "@/constants/app-data";
import { getUserClient } from "@/hooks/use-user";

  
const ProModal = () => {
    const proModal = useProModal();
    const [loading, setLoading ] = useState(false);
    const [showPayPal, setShowPayPal] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState('');
    const [selectedProductId, setSelectedProductId] = useState('');
    const [userId, setUserId ] = useState('');
    const handleUpgradeClick = async (planId: string, productId: string) => {
      setSelectedPlanId(planId);
      setSelectedProductId(productId);
      const userData = await getUserClient();
      setUserId(userData.id);
      setShowPayPal(true);
    };

    useEffect(() => {
      if (!proModal.isOpen) {
        setLoading(false);
        setShowPayPal(false);
        setSelectedPlanId('')
        setSelectedProductId('')
      }
    }, [proModal.isOpen]);
  return (
    <Dialog open = {proModal.isOpen} onOpenChange={proModal.onClose} >
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
                    <div className="flex items-center gap-x-2 font-bold py-1">
                        Upgrade to OneStopAi
                    </div>
                </DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-black">
            <div className='flex flex-col gap-6 items-center mt-10 lg:flex-row lg:items-end lg:justify-center'>
                {appData.plans.map((plan,index) => (
                    <div key={index} className={cn('p-10 rounded-3xl border border-secondary shadow-[0_7px_14px_#EAEAEA] max-w-sm w-full',
                        index %2 !==0 && 'border-primary bg-primary text-secondary'
                    )}>
                        <div className='flex justify-between'>
                            <h3 className={cn('text-lg font-bold ', 
                                index% 2 !== 0 ? 'text-secondary' : 'text-primary/90'
                            )}>{plan.name}</h3>
                                {plan.isPopular && (
                                    <div className='inline-flex text-sm px-4 py-1.5 rounded-xl border border-gray-900/90 bg-gray-900'>
                                    <span className='bg-[linear-gradient(to_right,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF)] text-transparent bg-clip-text font-medium'>
                                    {plan.popularText}
                                    </span>
                                </div>
                                )}
                        </div>
                        <div className='flex items-baseline gap-1 mt-[30px] mb-6'>
                            <span className='text-4xl font-bold tracking-tighter leading-none'>${plan.price}</span>
                            <span>/{plan.recuring}</span>
                        </div>
                          {!showPayPal &&(
                              <Button variant="premium" className="w-full border-0 " disabled={loading} onClick={() => handleUpgradeClick(plan.planId,plan.productId)}>
                              Upgrade Now
                              <Zap className="w-4 h-4 ml-2 fill-white" />
                            </Button>
                          )}
                        <ul className='flex flex-col gap-5 mt-8'>
                            {plan.features.map((feature, index) => (
                                <li key={index} className='text-sm flex items-center gap-4'>
                                    <CheckIcon  className='h-4 w-4'/>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
          </DialogDescription>
          {showPayPal && (
           <DialogFooter className="flex items-center justify-center">
              <div className="hidden md:block w-[25vw]">

              </div>
              <div className="w-full">
              <PayPalSubscriptionButton  planId={selectedPlanId} productId={selectedProductId} userId={userId}/>
              </div>
              <div className="hidden md:block w-[25vw]">

              </div>
         </DialogFooter>
          )}
        </DialogContent>
    </Dialog>
  )
}

export default ProModal
