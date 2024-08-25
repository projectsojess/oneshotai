'use client';
import { ResetPsswordForm } from "@/components/auth/reset-password-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const ResetPaswwordPage = () => {

    const router = useRouter();
    const signOut = async () => {

        const supabase =  createClient();
        await supabase.auth.signOut();
        
        router.push("/login");
    };

    return (
        <div>
             <Card className='w-[400px] shadow-md'>
                <CardHeader>
                    <div className='w-full flex flex-col gap-y-4 items-center justify-center'>
                        <h1 className='text-3xl font-semibold'>Change Password</h1>
                    </div>
                </CardHeader>
                <CardContent>
                    <ResetPsswordForm />
                </CardContent>
                <CardFooter>
                    <Button variant="ghost" type="button" onClick={signOut} className="hover:bg-transparent">
                        Back to Login
                    </Button>
                </CardFooter>
            </Card>

        </div>
    )
}

export default ResetPaswwordPage;