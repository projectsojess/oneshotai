
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Wand2Icon } from 'lucide-react';
import CustomAudioPlayer from './audio-player';
import { AudioPromptSchema } from '@/schemas/validation/audio-prompt-schema';
import toast from 'react-hot-toast';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '@/constants/error-messages';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { cn } from '@/lib/utils';

interface GeneratedAudio {
    url: string;
    fileName: string;
  }

const GenerationComponent = () => {
    const form = useForm<z.infer<typeof AudioPromptSchema>>({
        resolver: zodResolver(AudioPromptSchema),
        defaultValues: {
          prompt:"",
          model:"",
          voice : ''
        }
      })
      
      const [generatedAudio, setGeneratedAudio] = useState<GeneratedAudio | null>(null);
      const isLoading = form.formState.isSubmitting;

      const onSubmit = async (values : z.infer<typeof AudioPromptSchema>) => {
    
        try {
          const response = await axios.post('/api/audio-generation/audio', 
            {
              prompt : values.prompt,
              model : values.model,
              voice : values.voice
            },
            { 
              responseType: 'arraybuffer',
              headers: { 
                'Accept': 'audio/mpeg'
              }
            }
          );
    
          const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
          const audioUrl = URL.createObjectURL(audioBlob);
          const fileName = `${values.model}_generated_audio_voice_${values.voice}_${Date.now()}`;
          setGeneratedAudio({ url: audioUrl, fileName });
          form.reset();
        } catch (error) {
          toast.error(error.response?.data?.message || INTERNAL_SERVER_ERROR_MESSAGE)
        }finally {
 
        }
      };
      
  return (
    <div className=" p-6 rounded-lg shadow-lg">
    <h2 className="text-2xl font-bold mb-4 text-white">Audio Generation</h2>
    <Form {...form} >
        <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField 
                name='prompt'
                render = {({ field }) => (
                    <FormItem className='col-span-12 lg:col-span-10'>
                      <FormLabel className="text-sm sm:text-base text-gray-100">Prompt</FormLabel>
                      <FormControl>
                        <Textarea
                          className="w-full h-32 bg-gray-800 border-gray-600  focus:border-gray-500 focus:ring-gray-500 pr-10 rounded-md resize-none overflow-y-auto text-gray-100"
              
                          disabled={isLoading}
                          placeholder='Enter your text to convert to audio'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
            
            />
            <Button type='submit'
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            >
                <Wand2Icon className="mr-2 h-4 w-4" />
                Generate Audio
                <AiOutlineLoading3Quarters className={cn(!isLoading ?  "hidden" : "block animate-spin ml-2 w-4 h-4")}/>
            </Button>
        </form>
    </Form>
    {generatedAudio && (
      <div className='pt-4 pb-4'>
        <CustomAudioPlayer audioSrc={generatedAudio.url} fileName={generatedAudio.fileName} />
      </div>
    )}
  </div>
  )
}

export default GenerationComponent
