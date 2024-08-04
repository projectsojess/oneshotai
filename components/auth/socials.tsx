'use client';
import React, { useState } from 'react'
import { FcGoogle } from 'react-icons/fc';
import { BsFacebook } from 'react-icons/bs';
import { Button } from '../ui/button';
import { createClient } from '@/utils/supabase/client';


export const Socials = () => {
    const [isLoding, setIsLoading ] = useState(false);
    
    const onClick = async (provider: 'google' | 'facebook') => {
        setIsLoading(true);

        const supabase = createClient ();
        await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: window.location.origin + "/api/auth/callbacks"
            }
        });
    }
  return (
    <div className='flex items-center w-full gap-x-2'>
        <Button
            disabled={isLoding}
            onClick={() => onClick('google')}
            size='lg'
            className='w-full'
            variant='outline'
        
        >
            <FcGoogle/>
        </Button>
        <Button
            disabled={isLoding}
            size='lg'
            className='w-full'
            variant='outline'
            onClick={() => onClick('facebook')}
        >
            <BsFacebook/>
        </Button>
    </div>
  )
}