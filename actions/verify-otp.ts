"use server";
import { createServer } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


export const verifyOtp = async (values: {
	email: string;
	otp: string;
	type: "email" | "recovery";
	redirectTo?: string
}) => {
	const supabase = createServer();
	const { error } = await supabase.auth.verifyOtp({
		email: values.email,
		token: values.otp,
		type: values.type,
	});
    if(error) {
		console.log(error);
        return {error: error.message}
    }
	
    revalidatePath('/', 'layout')
    redirect(values.redirectTo ? values.redirectTo : '/dashboard');
};