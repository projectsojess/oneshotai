'use client'

import { SiMinutemailer } from "react-icons/si";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { verifyOtp } from "@/actions/verify-otp";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import ResendOtpCard from "./resend-otp-card";
import { FormError } from "./form-error";

interface OtpFormProps {
    email : string
    type: "email" | "recovery"
    sendAgainOtp: () => void,
    redirectTo? : string
}

const OtpForm = ({ email,sendAgainOtp, redirectTo,type } : OtpFormProps) => {

    const [ verifyStatus, setVerifyStatus] = useState<"success" | "failed" | null >(null);
    const [errorMessage, setErrorMessage ] = useState('');
    const[isSubmitting, startsubmitting] = useTransition();
    const [value, setValue] = useState("");

    const inputOptClass = cn({
		" border-green-500": verifyStatus === "success",
		" border-red-500": verifyStatus === "failed",
	});
    
    const clearValues = () => {
        setValue("");
    }
    const verifyOtpSubmit = async (value) => {

        setVerifyStatus(null);
        startsubmitting(() => {
            verifyOtp({email: email, otp: value, type: type, redirectTo : redirectTo})
        .then((data) => {

            if(data?.error){

                setVerifyStatus("failed");
                setErrorMessage(data.error);
            }
        })
        })

    }
  return (
    <div className="flex h-full items-center justify-center flex-col space-y-5">
        <SiMinutemailer className=" size-8" />
            <h1 className="text-2xl font-semibold text-center">
                Verify email
            </h1>

            <p className="text-center text-sm">
                A verification code has been sent to &nbsp;
                <span className="font-bold">
                    {email}
                </span>
            </p>
            <InputOTP
                value={value}
                pattern={REGEXP_ONLY_DIGITS}
                id="input-otp"
                maxLength={6}
                disabled={isSubmitting}
                onChange={async (value) => {
                    setValue(value);
                    if (value.length === 6) {
                        document.getElementById("input-otp")?.blur();
                       
                        await verifyOtpSubmit(value);
                    }
                }}
            >
                <InputOTPGroup>
                    <InputOTPSlot index={0} className={inputOptClass} />
                    <InputOTPSlot index={1} className={inputOptClass} />
                    <InputOTPSlot index={2} className={inputOptClass} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                    <InputOTPSlot index={3} className={inputOptClass} />
                    <InputOTPSlot
                        index={4}
                        className={cn(inputOptClass)}
                    />
                    <InputOTPSlot
                        index={5}
                        className={cn(inputOptClass)}
                    />
                </InputOTPGroup>
            </InputOTP>
            <FormError message={errorMessage} />
            <ResendOtpCard sendAgainOtp={sendAgainOtp} clearValues={clearValues}/>
    </div>
  )
}

export default OtpForm