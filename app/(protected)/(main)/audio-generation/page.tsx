'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/utils/page-header';
import { AudioLinesIcon } from 'lucide-react';
import TranscriptionComponent from '@/components/audio-generation/transcription';
import GenerationComponent from '@/components/audio-generation/generation';
import TranslationComponent from '@/components/audio-generation/translation';

  
const AudioGenerationPages = () => {
    
  return (
    <div>
       <PageHeader
        title='Audio AI'
        description='Generate / Translate / Transcribe audio'
        icon={AudioLinesIcon}
        iconColor='text-green-500'
        bgColor='bg-green-500/10'
      />
      <Tabs defaultValue='generation' className='w-full p-8'>
        <TabsList className='grid w-full grid-cols-3 bg-gray-600 text-gray-100'>
            <TabsTrigger value='generation' className='data-[state=active]:bg-green-500 data-[state=active]:text-white'>Generation</TabsTrigger>
            <TabsTrigger value='transcription' className='data-[state=active]:bg-green-500 data-[state=active]:text-white'>Transcription</TabsTrigger>
            <TabsTrigger value='translation' className='data-[state=active]:bg-green-500 data-[state=active]:text-white'>Translation</TabsTrigger>
        </TabsList>
        <TabsContent value='generation' className="space-y-6 bg-gray-700 rounded-lg">
          <GenerationComponent />
        </TabsContent>
        <TabsContent value='transcription' className=' space-y-6 bg-gray-700 rounded-lg'>
            <TranscriptionComponent />
        </TabsContent>
        <TabsContent value='translation'  className=' space-y-6 bg-gray-700 rounded-lg'>
            <TranslationComponent />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AudioGenerationPages
