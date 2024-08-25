
import { INTERNAL_SERVER_ERROR_MESSAGE, INVALID_DATA } from "@/constants/error-messages";
import { sendPasswordResetEmail } from "@/utils/mails";
import createAdmin from "@/utils/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

const supabase = createAdmin();
export async function GET(request:NextRequest) {

    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if(!email){

            return NextResponse.json({
                message: INVALID_DATA
            }, {status:400});
        }

        const { data, error } = await supabase.auth.admin.generateLink({
            type:'recovery',
            email: email
        });
        if(error) {

            return NextResponse.json({
                message: error.message
            },{status:400});
        }

        if(data.properties?.email_otp) {

            await sendPasswordResetEmail(email,data.properties?.email_otp);
            return NextResponse.json({
                message: `Email sent successfully to ${email}`
            },{status:200});
        }

    } catch (error) {
        
        return NextResponse.json({
            messsage: INTERNAL_SERVER_ERROR_MESSAGE
        }, {status:500});
    }
}