
'use client';
import PageHeader from '@/components/utils/page-header';
import { Video } from 'lucide-react';
import React from 'react'

const VideoGenerationPage = () => {
  return (
    <div>
      <PageHeader
        title='Motion AI'
        description='Create videos using your favourite AI models'
        icon={Video}
        iconColor='text-yellow-500'
        bgColor='bg-yellow-500/10'
      />
    </div>
  )
}

export default VideoGenerationPage
