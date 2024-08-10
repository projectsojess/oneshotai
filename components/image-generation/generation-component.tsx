'use client';
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, ImageIcon, Wand2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { ImagePromptSchema } from '@/schemas/validation/image-prompt-schema';
import { MODEL_CONFIGS, SD_IMAGE_MODELS, VARIATIONS } from '@/constants/app-constants';
import toast from 'react-hot-toast';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '@/constants/error-messages';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { cn } from '@/lib/utils';

const ImageGenerationComponent = ({ models } :  { models: { value: string; name: string }[]}) => {

    const [generatedImages, setGeneratedImages] = useState([]);
    const [isDownloading, setIsDownloading] = useState<number | null>(null);

    const form = useForm<z.infer<typeof ImagePromptSchema>>({
        resolver: zodResolver(ImagePromptSchema),
        defaultValues: {
          prompt:"",
          model:"dall-e-3",
          variations:'1',
          resolution: '1024x1024'
        }
      });

      const isLoading = form.formState.isSubmitting;
      const watchModel = form.watch('model');

      useEffect(() => {
        const modelConfig = MODEL_CONFIGS[watchModel as keyof typeof MODEL_CONFIGS];
        if (modelConfig) {
          form.setValue('resolution', modelConfig.defaultResolution);
          if (!modelConfig.supportsVariations) {
            form.setValue('variations', "1");
          }
        }
      }, [watchModel, form]);
      

      const onSubmit = async (values : z.infer<typeof ImagePromptSchema>) => {
        try {
            const  resp = await axios.post("/api/image-generation/image", {
              prompt : values.prompt.trim(),
              model : values.model,
              variations: values.variations,
              size : values.resolution
            });
      
            const { data } = resp;
            setGeneratedImages(data.urls);
          } catch (error) {
      
            toast.error(error.response?.data?.message || INTERNAL_SERVER_ERROR_MESSAGE)
          }
      }

      const getResolutionsForModel = (model: string) => {
        return MODEL_CONFIGS[model as keyof typeof MODEL_CONFIGS]?.resolutions || [];
      };
    
      const isVariationsSupported = (model: string) => {
        return MODEL_CONFIGS[model as keyof typeof MODEL_CONFIGS]?.supportsVariations || false;
      };
    
      const handleDownload = async (base64: string, index: number) => {
        try {
          setIsDownloading(index);
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/png" });
        
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `generated-image-${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(blobUrl);
        setIsDownloading(null);
        } catch (error) {
          
          toast.error("Unable to download image. Please try again")
        }
      };
  return (
    <div className=" p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-white">Image Generation</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <FormField
              name='prompt'
              render={({ field }) => (
                <FormItem className='mt-2'>
                  <FormLabel className="text-sm sm:text-base text-gray-100">Image Prompt</FormLabel>
                  <div className="relative">
                      <FormControl>
                        <Textarea 
                          className="w-full h-32 bg-gray-800 border-gray-600  focus:border-gray-500 focus:ring-gray-500 pr-10 rounded-md resize-none overflow-y-auto text-gray-100"
                          disabled={isLoading}
                          placeholder="Describe the image you want to generate..."
                          {...field}
                        />
                      </FormControl>
                  </div>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            {SD_IMAGE_MODELS.includes(watchModel) && (
              <FormField
              control={form.control}
              name="negativePrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base text-gray-100">Negative Prompt</FormLabel>
                  <FormControl>
                    <Input
                      className='bg-gray-800 text-gray-100 border-0'
                      placeholder="A blurb of text describing what you do not wish to see in the output image."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                name='model'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base text-gray-300">Model</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger className="w-full bg-gray-800 border-gray-600 text-white">
                          <SelectValue placeholder="Select a model" className='bg-gray-800 border-gray-600 text-white'/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className=" border-gray-600">
                        {models.map((model) => (
                          <SelectItem key={model.value} value={model.value} >{model.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                name='resolution'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base text-gray-300">Resolution</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger className="w-full  border-gray-600 bg-gray-800 text-white">
                          <SelectValue placeholder="Select a resolution" className='bg-gray-800 text-white'/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className=" border-gray-600">
                        {getResolutionsForModel(watchModel).map((resolution) => (
                          <SelectItem key={resolution} value={resolution}>{resolution}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name='variations'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base text-gray-300">Number of Variations</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isVariationsSupported(watchModel) || isLoading}>
                    <FormControl>
                      <SelectTrigger className="w-full bg-gray-800 text-white  border-gray-600">
                        <SelectValue placeholder="Select number of variations" className='bg-gray-800 text-white' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className=" border-gray-600">
                      {VARIATIONS.map((variation) => (
                        <SelectItem key={variation.toString()} value={variation.toString()}>{variation}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-red-500 hover:bg-red-600 text-gray-100 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Wand2 className="w-5 h-5" />
                Generate Image
                <AiOutlineLoading3Quarters className={cn(!isLoading ?  "hidden" : "block animate-spin ml-2 w-4 h-4")}/>
              </Button>
            </div>
          </form>
        </Form>
        {generatedImages && generatedImages.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-white">Generated Images</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {generatedImages.map((bas64: string, index) => (
                <div key={index} className="relative group">
                  <div className="relative overflow-hidden rounded-lg shadow-md">
                    <img
                      src={`data:image/png;base64,${bas64}`}
                      alt={`Generated image ${index + 1}`}
                      className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      onClick={() => handleDownload(bas64, index)}
                      disabled={isDownloading === index}
                      className="bg-red-500 text-black hover:bg-red-700 transition-colors duration-300 text-white"
                    >
                      {isDownloading === index ? (
                        <span className="flex items-center">
                          <ImageIcon className="animate-pulse mr-2" />
                          Downloading...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Download className="mr-2" />
                          Download
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  )
}

export default ImageGenerationComponent
