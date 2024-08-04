
"use client";
import * as z from 'zod';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
// import { login } from '@/actions/login';
import { LoginSchema } from '@/schemas/validation/login-schema';
import { FormError } from '@/components/auth/form-error';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export const LoginForm = () => {
  const [error, setError] = useState("");
  const router = useRouter ();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email:"",
      password:""
    }
  })
  const isSubmitting = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {

    setError(""); 
    // login(values)
    //   .then((data) => {
    //     setError(data && data.error ? data.error : '');
    //   })
    //   .catch(() => {
    //     setError("Something went wrong. Please try again later")
    //   })
  }

  return (
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
                  <Button size='sm' variant='link' asChild className='px-0 font-normal'>
                    <Link href='/auth/reset'>
                      Forgot Password ?
                    </Link>
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
          </Button>
      </form>
    </Form>
  )
}