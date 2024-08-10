'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MicIcon, Wand2,  EditIcon } from 'lucide-react';
import axios from 'axios';
import CustomAudioPlayer from '@/components/audio-generation/audio-player';
import { AudioPromptSchema } from '@/schemas/validation/audio-prompt-schema';
import { AUDIO_MODEL_CONFIGS } from '@/constants/app-constants';
import toast from 'react-hot-toast';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '@/constants/error-messages';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { cn } from '@/lib/utils';

interface AudioDialogProps {
    isOpen: boolean;
    onClose: () => void;
    prompt: string;
    models: { value: string; name: string }[];
    projectId: string,
    chatId:string
  }

  interface GeneratedAudio {
    url: string;
    fileName: string;
  }

const AudioDialog = ({ isOpen, onClose, prompt, models,projectId,chatId } : AudioDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editablePrompt, setEditablePrompt] = useState(prompt);
   const [generatedAudio, setGeneratedAudio] = useState<GeneratedAudio | null>(null);

  const form = useForm<z.infer<typeof AudioPromptSchema>>({
    resolver: zodResolver(AudioPromptSchema),
    defaultValues: {
      prompt: prompt,
      model: "tts-1",
      voice: AUDIO_MODEL_CONFIGS['tts-1'].default
    }
  });
  const isSubmitting = form.formState.isSubmitting;
  const watchModel = form.watch('model');

  useEffect(() => {
    const modelConfig = AUDIO_MODEL_CONFIGS[watchModel as keyof typeof AUDIO_MODEL_CONFIGS];
    if (modelConfig) {
      form.setValue('voice', modelConfig.default);
    }
  }, [watchModel, form]);

  useEffect(() => {
    setEditablePrompt(prompt);
    form.setValue('prompt', prompt);
  }, [prompt, form]);

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

    } catch (error) {
      
      toast.error(error.response?.data?.message || INTERNAL_SERVER_ERROR_MESSAGE)
    }
  };

 
  const getVoicesForModel = (model: string) => {
    return AUDIO_MODEL_CONFIGS[model as keyof typeof AUDIO_MODEL_CONFIGS]?.voices || [];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[90vw] max-h-[90vh] overflow-y-auto bg-gray-800 border border-gray-700 p-4">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-100 flex items-center gap-2 mb-2 mt-2">
            <MicIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
            Generate Audio
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-400">
            Customize your audio generation settings below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <FormField
              name='prompt'
              render={({ field }) => (
                <FormItem className='mt-2'>
                  <FormLabel className="text-sm sm:text-base text-gray-300">Audio Prompt</FormLabel>
                  <div className="relative">
                    {isEditing ? (
                      <FormControl>
                        <textarea
                          className="w-full h-64 bg-gray-700 border-gray-600 text-gray-100 focus:border-gray-500 focus:ring-gray-500 pr-10 rounded-md resize-none overflow-y-auto"
                          disabled={isSubmitting}
                          placeholder="Describe the audio you want to generate..."
                          onChange={(e) => {
                            setEditablePrompt(e.target.value);
                            field.onChange(e.target.value);
                          }}
                          value={editablePrompt}
                        />
                      </FormControl>
                    ) : (
                      <div className="w-full h-64 bg-gray-800 border border-gray-800 text-gray-100 rounded-md p-2 pr-10 overflow-y-auto">
                        {editablePrompt}
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2 text-white hover:text-white hover:bg-gray-900"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? 'Save' : <EditIcon className='w-4 h-4'/>}
                    </Button>
                  </div>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                name='model'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base text-gray-300">Model</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                      <FormControl>
                        <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-gray-100">
                          <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-700 border-gray-600">
                      {models.map((model) => (
                          <SelectItem key={model.value} value={model.value} className="text-gray-100">{model.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                name='voice'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base text-gray-300">Voice</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                      <FormControl>
                        <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-gray-100">
                          <SelectValue placeholder="Select a voice" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        {getVoicesForModel(watchModel).map((voice) => (
                          <SelectItem key={voice} value={voice} className="text-gray-100">{voice}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>
            {generatedAudio && (
              <div className='pt-4 pb-4'>
                <CustomAudioPlayer audioSrc={generatedAudio.url} fileName={generatedAudio.fileName} projectId={projectId} chatId={chatId}/>
              </div>
            )}
            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-green-500 hover:bg-green-600 text-gray-100 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Wand2 className="w-5 h-5" />
                Generate Audio
                <AiOutlineLoading3Quarters className={cn(!isSubmitting ?  "hidden" : "block animate-spin ml-2 w-4 h-4")}/>
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AudioDialog;