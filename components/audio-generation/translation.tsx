'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import {  BookAudioIcon, CheckIcon, CopyIcon } from 'lucide-react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TranslationSchema } from '@/schemas/validation/translation-schema';
import toast from 'react-hot-toast';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '@/constants/error-messages';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { cn } from '@/lib/utils';


const TranslationComponent = () => {
  const [translation, setTranslation] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);

  const form = useForm<z.infer<typeof TranslationSchema>>({
    resolver: zodResolver(TranslationSchema),
    defaultValues: {
      prompt: ''
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof TranslationSchema>) => {
    try {
      const formData = new FormData();
      formData.append('file', values.file);
      formData.append('prompt', values.prompt ? values.prompt : '');

      const resp = await axios.post("/api/audio-generation/audio/translation", formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { data } = resp;

      setTranslation( data.text );
      form.reset();

    } catch (error) {
      
      toast.error(error.response?.data?.message || INTERNAL_SERVER_ERROR_MESSAGE)
      
    }finally {
    }

  };
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(translation);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 5000); // Reset after 2 seconds
    } catch (err) {

      toast.error("Error copying content. PLease try again");
    }
  };

  return (
    <div className="p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">
        Audio Translation 
        </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="file"
                    accept=".flac,.mp3,.mp4,.mpeg,.mpga,.m4a,.ogg,.wav,.webm"
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                    className="file:mr-4 file:py-2 file:px-4 bg-gray-700
                      file:rounded-lg file:border-0 
                      file:text-sm file:font-semibold
                      file:bg-green-500 file:text-white text-white
                      hover:file:bg-green-300 border-0 outline-none
                       focus-visible:ring-0 focus-visible:ring-transparent h-14"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
               <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className='bg-gray-800 text-gray-100 border-0'
                    placeholder="An optional text to guide the model's style.  (The prompt should be in English.)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            disabled={isLoading}
          >
            <BookAudioIcon className="mr-2 h-4 w-4" />
            Translate audio
            <AiOutlineLoading3Quarters className={cn(!isLoading ?  "hidden" : "block animate-spin ml-2 w-4 h-4")}/>
          </Button>
        </form>
      </Form>
      {translation && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-white">Transcription:</h3>
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              className={`transition-colors ${
                !isCopied ? 'bg-green-500 text-white hover:bg-green-600 border-0 hover:text-white' : 'bg-gray-900 text-gray-300 border-0 hover:bg-gray-800 hover:text-gray-300'
              }`}
            >
              {isCopied ? (
                <>
                  <CheckIcon className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <CopyIcon className="mr-2 h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <Textarea
            value={translation}
            readOnly
            className="w-full h-64 bg-gray-800 text-gray-100 border-0"
          />
        </div>
      )}
    </div>
  );
};

export default TranslationComponent;