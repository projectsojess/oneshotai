
import { PasswordResetEmail } from '@/email/password-reset-template';
import { VerificationTemplate } from '@/email/verification-template';
import { Resend } from 'resend';


const resend = new Resend(process.env.RESEND_API_KEY);


export const sendVerificationEmail = async (
    email: string,
    code: string
) => {

   const resp = await resend.emails.send({
        from: 'OneStopAi <onboarding@resend.dev>',
        to: email,
        subject: "Confirm your email",
        react: VerificationTemplate({code})
    });

    return resp;
}

export const sendPasswordResetEmail = async (
    email: string,
    otp: string
) => {


   await resend.emails.send({
        from: 'OneStopAi <onboarding@resend.dev>',
        to: email,
        subject: "Reset your password",
        react: PasswordResetEmail({otp})
    });

}