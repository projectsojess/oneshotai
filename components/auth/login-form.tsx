
"use client";
import * as z from 'zod';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useTransition } from 'react';
import { login } from '@/actions/login';
import { LoginSchema } from '@/schemas/validation/login-schema';
import { FormError } from '@/components/auth/form-error';
import toast from 'react-hot-toast';
import axios from 'axios';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '@/constants/error-messages';
import OtpForm from './otp-form';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { cn } from '@/lib/utils';


export const LoginForm = ({hideSocial}) => {
  const [error, setError] = useState("");
  const [showOtp, setShowOtp ] = useState(false);
  const [email, setEmail ] = useState('');
  const[isSubmitting, startsubmitting] = useTransition();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email:"",
      password:""
    }
  })
  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {

    setError(""); 
    startsubmitting( () => {
      login(values)
      .then((data) => {
        setError(data && data.error ? data.error : '');
      })
      .catch(() => {
        setError("Something went wrong. Please try again later")
      })
    })
  }
  const handleForgotPassword = async() => {
    const email = form.getValues('email');
    if (!email) {
      setError("Please enter your email address first.");
    } else {
      setError("");
      setEmail(form.getValues('email'));
      try {
        const resp = await axios.get("/api/auth/reset",{
            params: { email: form.getValues('email')}
        })
        setShowOtp(true);
        hideSocial();
    } catch (error) {
        
        setError(error.response?.data?.message || INTERNAL_SERVER_ERROR_MESSAGE);
    }
      // You can replace this with actual forgot password logic
    }
  };

  const sendAgainOtp = async () => {
    setError(""); 
    try {
      const resp = await axios.get("/api/auth/reset",{
        params: { email: email}
    });
      toast.success(resp.data.message);
    } catch (error) {
      
      toast.error(error.response?.data?.message || INTERNAL_SERVER_ERROR_MESSAGE);
    }

  }
  return (
    !showOtp ? (
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-6'
        >
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='email'
              disabled={isSubmitting}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='jhon.doe@gmail.com'
                      type='email'
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
                )}
            >

            </FormField>
            <FormField
              control={form.control}
              disabled={isSubmitting}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='********'
                      type='password'
                    />
                  </FormControl>
                  <Button 
                  type="button"
                  size='sm' 
                  variant='link' 
                  className='px-0 font-normal'
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </Button>
                  <FormMessage/>
                </FormItem>
                )}
            >
            </FormField>
          </div>
          <FormError message={error}/>
          <Button
            type='submit'
            disabled={isSubmitting}
            className='w-full'
          >
            Login                 
            <AiOutlineLoading3Quarters className={cn(!isSubmitting ?  "hidden" : "block animate-spin ml-2 w-4 h-4")}/>
          </Button>
      </form>
    </Form>
    ) : 
    <OtpForm email={email} sendAgainOtp={sendAgainOtp} redirectTo='/reset-password' type='email' />
  )
}