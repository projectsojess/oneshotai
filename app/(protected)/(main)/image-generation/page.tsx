
'use client';
import EditImageComponent from '@/components/image-generation/editing-component';
import ImageGenerationComponent from '@/components/image-generation/generation-component';
import ImageUpscaleComponent from '@/components/image-generation/upscale-component';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/utils/page-header';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '@/constants/error-messages';
import axios from 'axios';
import { Image } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const ImageGenerationPage = () => {

  const [generateModels, setGenerateModels ] = useState([]);
  const [ upscaleModels, setUpscaleModels ] = useState([]);
  const [ editModels, setEditModels ] = useState([]);

  useEffect( () => {

    const getModels = async () => {

      try {
        const resp = await axios.get("/api/models");

        const { data } = resp;
        if(data.models) {
          const genData = data.models.filter((model) => model.type ==='IMAGE');
          setGenerateModels(genData);
  
          const upscaleData = data.models.filter((model) => model.type ==='IMAGEGUPSCALE');
          setUpscaleModels(upscaleData);
  
          const editData = data.models.filter((model) => model.type ==='IMAGEEDIT');
          setEditModels(editData);
        }

      } catch (error) {
        toast.error(error.response?.data?.message || INTERNAL_SERVER_ERROR_MESSAGE)
      }
    }

    getModels();
  },[])
  return (
    <div>
      <PageHeader
        title='Pixel AI'
        description='Create images using your favourite AI models'
        icon={Image}
        iconColor='text-red-500'
        bgColor='bg-red-500/10'
      />
      <Tabs defaultValue='generate' className='w-full p-8'>
        <TabsList className='grid w-full grid-cols-3 bg-gray-600 text-gray-100'>
          <TabsTrigger value='generate' className='data-[state=active]:bg-red-500 data-[state=active]:text-white'> Generate Image</TabsTrigger>
          <TabsTrigger value='upscale' className='data-[state=active]:bg-red-500 data-[state=active]:text-white'> Upscale image</TabsTrigger>
          <TabsTrigger value='edit' className='data-[state=active]:bg-red-500 data-[state=active]:text-white'> Edit image</TabsTrigger>
        </TabsList>
        <TabsContent value='generate' className='space-y-6 bg-gray-700 rounded-lg'>
            <ImageGenerationComponent models={ generateModels }
            />
        </TabsContent>
        <TabsContent value='upscale' className='space-y-6 bg-gray-700 rounded-lg'>
            <ImageUpscaleComponent models={ upscaleModels }
            />

        </TabsContent>
        <TabsContent value='edit' className='space-y-6 bg-gray-700 rounded-lg'>
            <EditImageComponent models={ editModels }
            />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ImageGenerationPage
