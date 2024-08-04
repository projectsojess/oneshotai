'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServer } from '@/utils/supabase/server'
import * as z from 'zod'
import { LoginSchema } from '@/schemas/validation/login-schema'

const supabase = createServer();

export const login = async ( values: z.infer<typeof LoginSchema>) => {

    const validatedFields =  LoginSchema.safeParse(values);

    if(!validatedFields.success){
        return { error : "Invalid data provided"}
    }

    const data = {
        email: validatedFields.data.email!,
        password: validatedFields.data.password!
    }
        
    const { error } = await supabase.auth.signInWithPassword(data);

    if(error) {

        return {error: error.message};
    }

    revalidatePath('/', 'layout')
    redirect("/dashboard");

}