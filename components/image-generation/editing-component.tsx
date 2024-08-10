'use client';
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, ImageIcon, Wand2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { EditImageSchema } from '@/schemas/validation/edit-image-schema';
import toast from 'react-hot-toast';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '@/constants/error-messages';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { cn } from '@/lib/utils';

const EditImageComponent = ({ models } :  { models: { value: string; name: string }[]}) => {

    const [isDownloading, setIsDownloading] = useState<number | null>(null);
    const [generatedImages, setGeneratedImages] = useState([]);

    const form = useForm<z.infer<typeof EditImageSchema>>({
        resolver: zodResolver(EditImageSchema),
        defaultValues: {
          prompt:"",
          model:"sd-edit-erase",

        }
      });

      const isLoading = form.formState.isSubmitting;
      const watchModel = form.watch('model');

      

      const onSubmit = async (values : z.infer<typeof EditImageSchema>) => {
        try {
          const formData = new FormData();
          formData.append('image', values.image);
          formData.append('mask', values.mask);
          const json = JSON.stringify(values);
          const blob = new Blob([json], {
            type: 'application/json'
          });
          formData.append("values",blob);
            const  resp = await axios.put("/api/image-generation/image/edit", formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
      
            const { data } = resp;
            setGeneratedImages(data.urls);
          } catch (error) {
            
            toast.error(error.response?.data?.message || INTERNAL_SERVER_ERROR_MESSAGE)
  
          }
      }
    
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
          
            toast.error("Unable to download image. Please try again.")
        }
      };
  return (
   <div className="p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">Image Editing</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base text-gray-100">Image File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".png"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                      className="file:mr-4 file:py-2 file:px-4 bg-gray-700
                        file:rounded-lg file:border-0
                        file:text-sm file:font-semibold
                        file:bg-red-500 file:text-white
                        hover:file:bg-red-300 border-0 outline-none
                        focus-visible:ring-0 focus-visible:ring-transparent text-white h-14"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchModel && (watchModel != 'sd-edit-outpaint' && watchModel != 'sd-edit-rm-bg') && (
              <FormField
              control={form.control}
              name="mask"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base text-gray-100">Mask File (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".png"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                      className="file:mr-4 file:py-2 file:px-4 bg-gray-700
                        file:rounded-lg file:border-0
                        file:text-sm file:font-semibold
                        file:bg-red-500 file:text-white
                        hover:file:bg-red-300 border-0 outline-none
                        focus-visible:ring-0 focus-visible:ring-transparent text-white h-14"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            )}
          </div>
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
                  <SelectContent className="border-gray-600">
                    {models.map((model) => (
                      <SelectItem key={model.value} value={model.value}>{model.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          { watchModel && (watchModel ==='sd-edit-erase' || watchModel === 'sd-edit-inpaint' || watchModel === 'sd-edit-sr') && (
              <FormField
              name='growMask'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base text-gray-300">Grow Mask</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="bg-gray-800 text-white border-gray-600"
                     placeholder={`${(watchModel === 'sd-edit-erase' || watchModel === 'sd-edit-sr') ? 'Between 0 and 20' : 'Between 0 and 100'}`}/>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            )}
          </div>

         {watchModel && (watchModel ==='sd-edit-inpaint' || watchModel === 'sd-edit-sr' || watchModel ==='sd-edit-outpaint') && (
           <FormField
           name='prompt'
           render={({ field }) => (
             <FormItem className='mt-2'>
               <FormLabel className="text-sm sm:text-base text-gray-100">Image Prompt 
                {watchModel === 'sd-edit-outpaint' ? ' (Optional)': ''}</FormLabel>
               <FormControl>
                 <Textarea 
                   className="w-full h-32 bg-gray-800 border-gray-600 focus:border-gray-500 focus:ring-gray-500 pr-10 rounded-md resize-none overflow-y-auto text-gray-100"
                   disabled={isLoading}
                   placeholder="Describe how you want to edit..."
                   {...field}
                 />
               </FormControl>
               <FormMessage className="text-red-400" />
             </FormItem>
           )}
         />
         )}
          {watchModel === 'sd-edit-sr' && (
            <FormField
              name='searchPrompt'
              render={({ field }) => (
                <FormItem className='mt-2'>
                  <FormLabel className="text-sm sm:text-base text-gray-100">Search Prompt</FormLabel>
                  <FormControl>
                    <Textarea 
                      className="w-full h-32 bg-gray-800 border-gray-600 focus:border-gray-500 focus:ring-gray-500 pr-10 rounded-md resize-none overflow-y-auto text-gray-100"
                      disabled={isLoading}
                      placeholder="Enter search prompt..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          )}
          { watchModel && (watchModel ==='sd-edit-inpaint' || watchModel === 'sd-edit-sr') && (
            <FormField
            name='negativePrompt'
            render={({ field }) => (
              <FormItem className='mt-2'>
                <FormLabel className="text-sm sm:text-base text-gray-100">Negative Prompt (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    className="w-full h-32 bg-gray-800 border-gray-600 focus:border-gray-500 focus:ring-gray-500 pr-10 rounded-md resize-none overflow-y-auto text-gray-100"
                    disabled={isLoading}
                    placeholder="Describe what you don't want in the image..."
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          )}

            { watchModel && watchModel ==='sd-edit-sr' && (
              <FormField
              name='creativity'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base text-gray-300">Creativity</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="bg-gray-800 text-white border-gray-600" placeholder='Between 0 and 1'/>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            )}

{watchModel === 'sd-edit-outpaint' && (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                name='left'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base text-gray-300">Left</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="bg-gray-800 text-white border-gray-600" placeholder='Between 0 and 2000'/>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                name='right'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base text-gray-300">Right</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="bg-gray-800 text-white border-gray-600" placeholder='Between 0 and 2000'/>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                name='up'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base text-gray-300">Up</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="bg-gray-800 text-white border-gray-600" placeholder='Between 0 and 2000'/>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                name='down'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base text-gray-300">Down</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="bg-gray-800 text-white border-gray-600" placeholder='Between 0 and 2000'/>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>
          )}


          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-red-500 hover:bg-red-600 text-gray-100 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Wand2 className="w-5 h-5" />
              Edit Image
              <AiOutlineLoading3Quarters className={cn(!isLoading ?  "hidden" : "block animate-spin ml-2 w-4 h-4")}/>
            </Button>
          </div>
        </form>
      </Form>

      { generatedImages && generatedImages.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-white">Generated Images</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {generatedImages.map((base64: any, index) => (
              <div key={index} className="relative group">
                <div className="relative overflow-hidden rounded-lg shadow-md">
                  <img
                    src={`data:image/png;base64,${base64}`}
                    alt={`Generated image ${index + 1}`}
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    onClick={() => handleDownload(base64, index)}
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

export default EditImageComponent
