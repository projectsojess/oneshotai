
"use client";
import * as z from 'zod';
import React, {  useState } from 'react';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { ResetPasswordSchema } from '@/schemas/validation/reset-password-schema';
import { FormError } from '@/components/auth/form-error';
import { FormSuccess } from '@/components/auth/form-success';

export const ResetPsswordForm = () => {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password:"",
      confirmPassword:""
    }
  })
  const isSubmitting = form.formState.isSubmitting;

  
  const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {

    setError(""); 
    setSuccess("");
    const supabase = createClient();
     await supabase.auth.updateUser({
      password : values.password
     });
     router.push("/dashboard"); 
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-6'
        >
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='password'
              disabled={isSubmitting}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
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
                  <FormLabel>Confirm New Password</FormLabel>
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
            Reset Password
          </Button>
      </form>
    </Form>
  )
}
