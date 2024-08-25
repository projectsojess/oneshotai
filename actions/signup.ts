'use server'
import * as z from 'zod';
import createAdmin from  '@/utils/supabase/admin';
import { SignupSchema } from '@/schemas/validation/signup-schema';
import { sendVerificationEmail } from '@/utils/mails';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '@/constants/error-messages';

export const signup = async (values : z.infer<typeof SignupSchema>) => {
    
    const validatedFields =  SignupSchema.safeParse(values);

    if(!validatedFields.success){

        return {error: 'Invalid Data provided'}
    }


        

    const supabaseAdmin = createAdmin();
    
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
        type: "signup",
        email: validatedFields.data.email,
        password: validatedFields.data.password,
    });
    if(error) {
        return {error: error.message};
    }
    if(data){

        if (data.properties?.email_otp) {

            const mail = await sendVerificationEmail(validatedFields.data.email,data.properties?.email_otp );
            if(!mail) {
    
                return {error: INTERNAL_SERVER_ERROR_MESSAGE}
            }

            return {success:`Verification email sent to ${validatedFields.data.email}`};
        }
    }

    return {error: INTERNAL_SERVER_ERROR_MESSAGE};

}