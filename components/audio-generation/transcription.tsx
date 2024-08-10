'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { AudioWaveformIcon, CheckIcon, CopyIcon } from 'lucide-react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TranscriptionSchema } from '@/schemas/validation/transcription-schema';
import InfoTooltip from '../utils/info-tooltip';
import toast from 'react-hot-toast';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '@/constants/error-messages';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { cn } from '@/lib/utils';


const TranscriptionComponent = () => {
  const [transcription, setTranscription] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);

  const form = useForm<z.infer<typeof TranscriptionSchema>>({
    resolver: zodResolver(TranscriptionSchema),
    defaultValues: {
      language: 'en',
      prompt: ''
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof TranscriptionSchema>) => {
    try {
      const formData = new FormData();
      formData.append('file', values.file);
      formData.append('prompt', values.prompt ? values.prompt : '');
      formData.append('language', values.language);

      const resp = await axios.post("/api/audio-generation/audio/transcription", formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { data } = resp;

      setTranscription( data.text );
      form.reset();
    } catch (error) {
      
      toast.error(error.response?.data?.message || INTERNAL_SERVER_ERROR_MESSAGE)
      
    }finally {
    }

  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcription);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 5000); // Reset after 2 seconds
    } catch (err) {

      toast.error("Error copying content. PLease try again");
    }
  };

  return (
    <div className="p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">
        Audio Transcription <InfoTooltip info='The language of the input audio. Supplying the input language
         in ISO-639-1 format will improve accuracy and latency.'/>
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
                      file:bg-green-500 file:text-white
                      hover:file:bg-green-300 border-0 outline-none
                       focus-visible:ring-0 focus-visible:ring-transparent text-white h-14"
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
                    placeholder="Optional prompt to guide the transcription (The prompt should match the audio language)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem className='w-[30vh]'>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className='bg-gray-900 text-gray-100 border-0'>
                      <SelectValue placeholder="Select Language" className='bg-gray-900 text-gray-100'/>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="it">Italian</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                    <SelectItem value="nl">Dutch</SelectItem>
                    <SelectItem value="ru">Russian</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            disabled={isLoading}
          >
            <AudioWaveformIcon className="mr-2 h-4 w-4" />
            Transcribe audio
            <AiOutlineLoading3Quarters className={cn(!isLoading ?  "hidden" : "block animate-spin ml-2 w-4 h-4")}/>
          </Button>
        </form>
      </Form>
      {transcription && (
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
            value={transcription}
            readOnly
            className="w-full h-64 text-gray-100 border-0"
          />
        </div>
      )}
    </div>
  );
};

export default TranscriptionComponent;