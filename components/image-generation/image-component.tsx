'use client'
import React, { useState } from 'react'
import {  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Save, Download } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '@/constants/error-messages';
import { Button } from '../ui/button';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { cn } from '@/lib/utils';

const ImageComponent = ({ imageData, index, projectId, chatId }) => {

    const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);


  const saveImage = async() => {
    setIsSaving(true);
    try {
      const resp = await axios.post("/api/images",{
        base64:imageData.base64,
        projectId,
        chatId
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
    <div className="relative group bg-gray-700 rounded-lg overflow-hidden">
    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="secondary" className="w-8 h-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className='bg-gray-800 text-white border-0 rounded'>
          <DropdownMenuItem onClick={() => console.log('Edit')} className='text-gray-200 focus:bg-gray-700 focus:text-gray-100 hover:bg-gray-700 hover:text-gray-100'>
            <Edit className='h-4 w-4 mr-2'/> <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={saveImage} className='text-gray-200 focus:bg-gray-700 focus:text-gray-100 hover:bg-gray-700 hover:text-gray-100'>
            <Save className='w-4 h-4 mr-2' /><span>Save</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <img src={`data:image/png;base64,${imageData.base64}`} alt={`Generated image ${index + 1}`} className="w-full h-auto" />
    {isSaving && (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-gray-700">
             <AiOutlineLoading3Quarters className={cn(!isSaving ?  "hidden" : "block animate-spin ml-2 w-20 h-20")}/>
      </div>
    )}
    <div className="p-2">
      <Button
        onClick={() => handleDownload()}
        variant="secondary"
        className="w-full text-white bg-red-500 hover:bg-red-600"
        disabled={isDownloading}
      >
        {isDownloading ? (
          <>
            <div className="spinner-small mr-2"></div>
            Downloading
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" /> Download
          </>
        )}
      </Button>
    </div>
      
    </div>
  )
}

export default ImageComponent
