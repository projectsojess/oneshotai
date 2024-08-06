'use client';
import * as z from 'zod';
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { PromptSchema } from '@/schemas/validation/prompt-schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Plus } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { OPENAI_TEXT_ASSISTENT } from '@/constants/app-constants';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '@/constants/error-messages';

interface PromptInputProps {
  models: any[],
  projectId?: string
}
const PromptInput = ({  models,projectId } : PromptInputProps) => {
  const router = useRouter();

    const form = useForm<z.infer<typeof PromptSchema>>({
        resolver: zodResolver(PromptSchema),
        defaultValues: {
          prompt:"",
          model:"",
        }
      })
      const isLoading = form.formState.isSubmitting;


  const onSubmit = async (values : z.infer<typeof PromptSchema>) => {
    try {
      const model = models.find( model => model.value === values.model);
      const resp = await axios.post("/api/conversations", {
        values,
        projectId,
        icon: model.icon
      });
      const { data } = resp;
      router.push(`/conversations/${data.chatId}`);
    } catch (error) {

      toast.error(error.response?.data?.message || INTERNAL_SERVER_ERROR_MESSAGE)
    }
  }
  return (
    <div className='px-4 lg:px-8 mt-4 border-1 rounded-xl'>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <div className='rounded-lg border p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2'>
          <FormField
            name='prompt'
            render={({ field }) => (
              <FormItem className='col-span-12 lg:col-span-10'>
                <FormControl>
                  <Input
                    className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent'
                    disabled={isLoading}
                    placeholder='Which is the best text generative model?'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className='col-span-12 lg:col-span-2 w-full hover:bg-gray-700' disabled={isLoading}>
            {!isLoading && (<MessageSquare className='mr-2'/>)}
            {!isLoading && ('New Chat')}
            <AiOutlineLoading3Quarters className={cn(!isLoading ?  "hidden" : "block animate-spin ml-2 w-4 h-4")}/>
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <FormField
            name='model'
            render={({ field }) => (
              <FormItem className='  w-full sm:w-2/3 md:w-1/3 lg:w-1/5'>
                <Select onValueChange={field.onChange} defaultValue={field.value} >
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent'>
                    { models && models.map( (model, index) => (
                      <SelectItem value={model.value} key={index}>{model.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  </div>
  )
}

export default PromptInput
