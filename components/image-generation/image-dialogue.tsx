import React, { useEffect, useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { ImageIcon, Wand2, Edit2, Download, MoreVertical, Edit, Save } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import axios from 'axios';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { ImagePromptSchema } from '@/schemas/validation/image-prompt-schema';
import toast from 'react-hot-toast';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '@/constants/error-messages';
import { MODEL_CONFIGS, VARIATIONS } from '@/constants/app-constants';


interface ImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: string;
  models: { value: string; name: string }[];
}

const ImageDialog: React.FC<ImageDialogProps> = ({ isOpen, onClose, prompt, models }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editablePrompt, setEditablePrompt] = useState(prompt);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isDownloading, setIsDownloading] = useState<number | null>(null);

  const form = useForm<z.infer<typeof ImagePromptSchema>>({
    resolver: zodResolver(ImagePromptSchema),
    defaultValues: {
      prompt: prompt,
      model: "dall-e-3",
      variations: "1",
      resolution: '256x256'
    }
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof ImagePromptSchema>) => {
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
  };

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


  useEffect(() => {
    setEditablePrompt(prompt);
    form.setValue('prompt', prompt);
  }, [prompt, form]);

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
      
      toast.error(error.response?.data?.message || INTERNAL_SERVER_ERROR_MESSAGE)
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[90vw] h-[90vh] max-h-[90vh] overflow-y-auto bg-gray-800 border border-gray-700 p-4">
        <Tabs defaultValue='generate' className="w-full mt-7">
        <TabsList className="grid w-full grid-cols-2 bg-gray-700 p-1 rounded-lg">
          <TabsTrigger value="generate"  className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">Generate Image</TabsTrigger>
          <TabsTrigger value="images" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">Images</TabsTrigger>
        </TabsList>
        <TabsContent value='generate'>
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-100 flex items-center gap-2 mb-2 mt-2">
            <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
            Generate Image
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-400">
            Customize your image generation settings below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <FormField
              name='prompt'
              render={({ field }) => (
                <FormItem className='mt-2'>
                  <FormLabel className="text-sm sm:text-base text-gray-300">Image Prompt</FormLabel>
                  <div className="relative">
                    {isEditing ? (
                      <FormControl>
                        <textarea
                          className="w-full h-32 bg-gray-700 border-gray-600 text-gray-100 focus:border-gray-500 focus:ring-gray-500 pr-10 rounded-md resize-none overflow-y-auto"
                          disabled={isLoading}
                          defaultValue={prompt}
                          placeholder="Describe the image you want to generate..."
                          onChange={(e) => {
                            setEditablePrompt(e.target.value);
                            field.onChange(e.target.value);
                          }}
                        />
                      </FormControl>
                    ) : (
                      <div className="w-full h-32 bg-gray-800 border border-gray-800 text-gray-100 rounded-md p-2 pr-10 overflow-y-auto">
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
                      {isEditing ? 'save' : <Edit2  className='w-4 h-4'/>}
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
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
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
                name='resolution'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base text-gray-300">Resolution</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-gray-100">
                          <SelectValue placeholder="Select a resolution" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        {getResolutionsForModel(watchModel).map((resolution) => (
                          <SelectItem key={resolution} value={resolution} className="text-gray-100">{resolution}</SelectItem>
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
                      <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-gray-100">
                        <SelectValue placeholder="Select number of variations" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {VARIATIONS.map((variation) => (
                        <SelectItem key={variation.toString()} value={variation.toString()} className="text-gray-100">{variation}</SelectItem>
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
              </Button>
            </div>
          </form>
        </Form>
        </TabsContent>
        <TabsContent value='images'>
       {generatedImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {generatedImages.map((data: any, index) => (
                  <div key={index} className="relative group bg-gray-700 rounded-lg overflow-hidden">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="secondary" className="w-8 h-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className='bg-gray-800 text-white border-0 border-radius-1'>
                          <DropdownMenuItem onClick={() => console.log('Edit')} className='text-gray-200 focus:bg-gray-700 focus:text-gray-100 hover:bg-gray-700 hover:text-gray-100'>
                            <Edit className='h-4 w-4 mr-2'/> <span> Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => console.log('Share')} className='text-gray-200 focus:bg-gray-700 focus:text-gray-100 hover:bg-gray-700 hover:text-gray-100'>
                            <Save className='w-4 h-4 mr-2' /><span>Save</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <img src={`data:image/png;base64,${data.b64_json}`}  alt={`Generated image ${index + 1}`} className="w-full h-auto" />
                    <div className="p-2">
                    <Button
                        onClick={() => handleDownload(data.b64_json, index)}
                        variant="secondary"
                        className="w-full text-white bg-red-500 hover:bg-red-600"
                        disabled={isDownloading === index}
                      >
                        {isDownloading === index ? (
                          "Downloading..."
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" /> Download
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ImageIcon className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                <p className="text-gray-400">No images generated yet. Use the Generate Image tab to create some!</p>
              </div>
            )}
        </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDialog;