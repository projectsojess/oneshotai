import { cn } from "@/lib/utils";
import { useTransition } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const ResendOtpCard = ({sendAgainOtp, clearValues}) => {

    const [isSendAgain, startSendAgain] = useTransition();

    const sendAgain = async() => {

      if(!isSendAgain) {
        clearValues();
        startSendAgain(async () => await sendAgainOtp());
      }
    }
  return (
    <div className="text-sm flex gap-2">

        <p>Didn't work?</p>
        <span className="text-primary cursor-pointer hover:underline transition-all flex items-center gap-2 "

          onClick={sendAgain}
        >

            <AiOutlineLoading3Quarters className={cn(!isSendAgain ?  "hidden" : "block animate-spin")}/>
            Resend code.
        </span>
    </div>  
  )
}

export default ResendOtpCard