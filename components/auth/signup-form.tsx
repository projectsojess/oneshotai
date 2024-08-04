
"use client";
import * as z from 'zod';
import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signup } from '@/actions/signup';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { SignupSchema } from '@/schemas/validation/signup-schema';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '@/constants/error-messages';
import { FormError } from '@/components/auth/form-error';
import { FormSuccess } from '@/components/auth/form-success';
import OtpForm from '@/components/auth/otp-form';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { cn } from '@/lib/utils';

export const SignupForm = ({ hideSocial }) => {
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState(null);
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email:"",
      password:"",
      confirmPassword:""
    }
  })
  const [isSubmitting, startSubmitting ] = useTransition();

  const onSubmit = async (values: z.infer<typeof SignupSchema>) => {
    setError(""); 
    setSuccess("");
    startSubmitting(() => {
      signup(values)
      .then((data) => {
        setError(data.error ? data.error : '');
        setSuccess(data.success ? data.success : '');
        setEmail(values.email)
        if(!data.error){
          setShowOtp(true);
          hideSocial();
        }
      })
      .catch(() => {
        setError(INTERNAL_SERVER_ERROR_MESSAGE);
      })
    })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  }

  const sendAgainOtp = async () => {

    setError(""); 
    setSuccess("");
    signup(form.getValues())
      .then((data) => {
        
        if(data.error) {

          toast.error(data.error)
        }
        if(data.success) {
          toast.success(data.success)
        }
      })
      .catch(() => {
        setError(INTERNAL_SERVER_ERROR_MESSAGE);
      })
  }
  return  !showOtp ?

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
            <FormField
              control={form.control}
              name='password'
              disabled={isSubmitting}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                   <div className="relative">
                    <Input
                      {...field}
                      placeholder='********'
                      type={showPassword ? 'text' : 'password'}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={isSubmitting}
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
                )}
            >

            </FormField>
            <FormField
              control={form.control}
              name='confirmPassword'
              disabled={isSubmitting}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder='Re-type your password'
                      type={showConfirmPassword ? 'text' : 'password'}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={isSubmitting}
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
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
            Signup  <AiOutlineLoading3Quarters className={cn(!isSubmitting ?  "hidden" : "block animate-spin ml-2")}/>

          </Button>
      </form>
    </Form>
    ): (
      <OtpForm email={email} sendAgainOtp={sendAgainOtp} type='email'/>
    );
}
