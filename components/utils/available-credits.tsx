'use client'

import { useEffect, useState } from "react"
import { Card, CardContent } from "../ui/card";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import PremiumProgress from "@/components/utils/premium-progress";
import { useProModal } from "@/hooks/use-pro-modal";
import SkeletonAvailableCredits from "../skeletons/utils/skeleton-available-credits";
import { getUserPlanClient } from "@/hooks/use-user";
import { Plan } from "@/types/plan";


const AvailableCredits = () => {

    const [mounted, setMounted ] = useState(false);
    const proModal = useProModal();
    const [loading, setLoading] = useState(true);
    const [plan, setPlan ] = useState(null);

    useEffect(() => {
        setMounted(true)
        const getPlan = async() => {

          const plan :Plan = await getUserPlanClient();

          setPlan(plan);
          setLoading(false);
        }
        getPlan();
        return () => setMounted(false);
    },[]);

    if(!mounted){
        return null;
    }
  return (
    <div className="px-3"> 
      {loading && <SkeletonAvailableCredits />}
      {!loading && (
        <Card className="bg-white/10 border-0"> 
        <CardContent className="py-6">
            <div className=" text-center text-sm text-white mb-2 space-y-2">
                <p>{plan.available_credits} of {plan.total_credits} Credits left</p>
                <PremiumProgress value={(plan.available_credits/plan.total_credits) * 100} />
            </div>
            {plan.plan && (plan.plan ==='FREE' || plan.plan === 'PRO') && (
                <Button className="w-full mt-2" variant="premium" onClick={proModal.onOpen}>
                    Upgrade to {plan.plan === 'FREE' ? 'PRO' : 'PREMIUM'} <Zap className="h-4 w-4 ml-2 fill-white"/>
                </Button>
            )}
        </CardContent>
      </Card>
      )}
    </div>
  )
}

export default AvailableCredits
