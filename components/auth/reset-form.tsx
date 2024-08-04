
"use client";
import * as z from 'zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/util/form-error';
import { FormSuccess } from '@/components/util/form-success';
import { ResetFormSchema } from '@/schemas/reset-password-schema';
import axios from 'axios';
import OtpForm from './otp-form';
import toast from 'react-hot-toast';
import { appConfig } from '@/config/app-config';

export const ResetForm = () => {
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const [showOtp, setShowOtp ] = useState(false);

  const form = useForm<z.infer<typeof ResetFormSchema>>({
    resolver: zodResolver(ResetFormSchema),
    defaultValues: {
      email:""
    }
  })
  const isSubmitting = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof ResetFormSchema>) => {
    setError(""); 
    setSuccess("");
    setEmail(values.email);
    try {
        const resp = await axios.get("/api/auth/reset",{
            params: { email: values.email}
        })
        setSuccess(resp.data.message);
        setShowOtp(true);
    } catch (error) {
        
        setError(appConfig.messages.errorMessages.serverError);
    }
  }

  const sendAgainOtp = async () => {
    setError(""); 
    setSuccess("");
    try {
      const resp = await axios.get("/api/auth/reset",{
        params: { email: email}
    });
      toast.success(resp.data.message);
    } catch (error) {
      
      toast.error(error.response?.data?.message || appConfig.messages.errorMessages.serverError);
    }

  }

  return !showOtp ? 
  (
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
          </div>
          <FormError message={error}/>
          <FormSuccess message={success}/>
          <Button
          disabled={isSubmitting}
            type='submit'
            className='w-full'
          >
            Send Email
          </Button>
      </form>
    </Form>
  ): (<OtpForm email={email} sendAgainOtp={sendAgainOtp} redirectTo='/auth/reset-password' type='email' />);
}
