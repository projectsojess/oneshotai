import { useProModal } from "@/hooks/use-pro-modal"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge";
import { Coins, Zap, Image, AudioWaveformIcon, Sparkles, CoinsIcon, X } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { useRef, useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import GradientIcon from "./gradient-icon";

const features = [
    { text: "Purchase additional credits if exhausted", icon: CoinsIcon, isGold: true },
    { text: "Pro Image Features", icon: Image },
    { text: "Pro Audio Features", icon: AudioWaveformIcon },
    { text: "Early access to new features", icon: Sparkles }
  ];
  
const ProModal = () => {
    const proModal = useProModal();
    const [loading, setLoading ] = useState(false);

    const createOrder = async () => {
      setLoading(true);
     
      // TODO

    }

  return (
    <Dialog open = {proModal.isOpen} onOpenChange={proModal.onClose} >
        <DialogContent className="bg-gray-800 border-0 text-gray-300">
            <DialogHeader>
                <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
                    <div className="flex items-center gap-x-2 font-bold py-1">
                        Upgrade to OneStopAi
                        <Badge variant="premium" className="text-sm py-1">
                            PRO
                        </Badge>
                    </div>
                </DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium text-gray-300">
                Unlock the full potential of AI-powered creation
                <div className="p-4">
          <div className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-lg p-4 mb-4 shadow-lg">
            <div className="flex items-center justify-center gap-2 text-xl font-bold mb-2">
              <GradientIcon Icon={Coins}  isGold={true}/>
              2200 Credits Included
            </div>
            <p className="text-center text-sm">Use these credits for any AI task - images, audio, or conversations!</p>
          </div>
          <h3 className="font-semibold text-lg mb-4 text-left">What you'll get:</h3>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <GradientIcon Icon={feature.icon} isGold={feature.isGold}/>
                <span className="ml-3">{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>
            </DialogDescription>
            <DialogFooter >
          <Button variant="premium" className="w-full border-0 " disabled={loading} onClick={createOrder}>
          Upgrade Now
          <Zap className="w-4 h-4 ml-2 fill-white" />
        </Button>
        </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default ProModal
