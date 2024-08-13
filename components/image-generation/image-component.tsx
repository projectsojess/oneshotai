'use client'
import React, { useState } from 'react'
import {  Save, Download } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '@/constants/error-messages';
import { Button } from '../ui/button';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import Image from 'next/image';

interface ImageComponentProps {
  imageData: any,
  index: number,
  projectId?:string,
  chatId?: string,
}

const ImageComponent = ({ imageData, index, projectId, chatId }: ImageComponentProps) => {

    const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);


  const saveImage = async() => {
    setIsSaving(true);
    try {
      const resp = await axios.post("/api/images",{
        base64:imageData.base64,
        url: imageData.url,
        projectId,
        chatId,
        title:'test'
      });
      toast.success(resp.data?.message);
    } catch (error) {
      
      toast.error(error?.response?.data?.message || INTERNAL_SERVER_ERROR_MESSAGE)
    }finally {
        setIsSaving(false);
    }
  }
  
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
    const byteCharacters = atob(imageData.base64);
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
    } catch (error) {
      
      toast.error(error.response?.data?.message || INTERNAL_SERVER_ERROR_MESSAGE)
    }finally{
      setIsDownloading(null);
    }
  };

  return (
    <div className="relative bg-gray-700 rounded-lg overflow-hidden">
    <div className="aspect-square relative">
      <Image 
      src={imageData.type ==='url'? imageData.url : `data:image/png;base64,${imageData.base64}`}
      alt={`Generated image ${index + 1}`}
      layout="fill"
      objectFit="contain"
      />
    </div>
    <div className="p-2 flex space-x-2">
      <Button
        onClick={saveImage}
        variant="secondary"
        className="flex-1 text-white bg-green-500 hover:bg-green-600"
        disabled={isSaving}
      >
        {isSaving ? 'Saving' : 'Save'}
        { isSaving && (
           <AiOutlineLoading3Quarters className="animate-spin h-4 w-4 ml-2" />
        )}
         { !isSaving && (
           <Save className='ml-2 h-4 w-4'/>
        )}
      </Button>
      <Button
        onClick={handleDownload}
        variant="secondary"
        className="flex-1 text-white bg-red-500 hover:bg-red-600"
        disabled={isDownloading}
      >
        {isDownloading ? 'Downloading' : 'Download'}
        {isDownloading ? (
          <AiOutlineLoading3Quarters className="animate-spin h-4 w-4 ml-2" />
        ) : (
          <Download className="h-4 w-4 ml-2" />
        )}
      </Button>
    </div>
  </div>
  )
}

export default ImageComponent
