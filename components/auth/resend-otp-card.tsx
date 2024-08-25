import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState, useTransition } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const ResendOtpCard = ({sendAgainOtp, clearValues}) => {

    const [attempts, setAttempts] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isSendAgain, setIsSendAgain] = useState(false);

    const calculateWaitTime = useCallback(() => {
      // Increase wait time with each attempt, cap at 3 attempts
      const waitTimes = [30, 60, 120]; // 30 seconds, 1 minute, 2 minutes
      return waitTimes[Math.min(attempts, 2)];
    }, [attempts]);
    

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [timeLeft]);
  
   
  const sendAgain = async () => {
    if (attempts < 3 && timeLeft === 0) {
      setIsSendAgain(true);
      clearValues();
      await sendAgainOtp();
      setAttempts(attempts + 1);
      setTimeLeft(calculateWaitTime());
      setIsSendAgain(false);
    }
  };
  return (
    <div className="text-sm flex gap-2">
    <p>Didn't work?</p>
    {attempts < 3 ? (
      timeLeft > 0 ? (
        <span className="text-gray-500">
          Wait {timeLeft} seconds to resend.
        </span>
      ) : (
        <span
          className="text-primary cursor-pointer hover:underline transition-all flex items-center gap-2"
          onClick={sendAgain}
        >
          <AiOutlineLoading3Quarters
            className={cn(!isSendAgain ? "hidden" : "block animate-spin")}
          />
          Resend code
        </span>
      )
    ) : (
      <span className="text-gray-500">
        Maximum attempts reached. Please try again later.
      </span>
    )}
  </div>
  )
}

export default ResendOtpCard