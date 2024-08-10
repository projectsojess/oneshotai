'use client';
import AudioDialog from "@/components/audio-generation/audio-dialog";
import ChatBox from "@/components/conversations/chat-box";
import ChatDrawer from "@/components/conversations/chat-drawer";
import ChatSidebar from "@/components/conversations/chat-sidebar";
import ImageDialog from "@/components/image-generation/image-dialogue";
import { useState } from "react";

const ChatPage = ({params} : {params : {chatId: string}}) => {

    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
    const [isAudioDialogOpen, setIsAudioDialogOpen] = useState(false);
    const [selectedPrompt, setSelectedPrompt] = useState('');

   const openImageDialog = (prompt: string) => {
    setSelectedPrompt(prompt);
    setIsImageDialogOpen(true);
  }

  const openAudioDialog = (prompt: string) => {
    setSelectedPrompt(prompt);
    setIsAudioDialogOpen(true);
  }
    return (
        <div className='h-full relative'>
            {isImageDialogOpen && (
        <div className='fixed inset-0 z-50'>
        <ImageDialog
          isOpen={isImageDialogOpen}
          onClose={() => setIsImageDialogOpen(false)}
          prompt={selectedPrompt}
          models={[
            { value: 'dall-e-3', name: 'DALL-E 3' },
            { value: 'dall-e-2', name: 'DALL-E 2' }
          ]}
        />
      </div>
      )}
      {isAudioDialogOpen && (
        <div className='fixed inset-0 z-50'>
        <AudioDialog
          isOpen={isAudioDialogOpen}
          onClose={() => setIsAudioDialogOpen(false)}
          prompt={selectedPrompt}
          models={[
            { value: 'tts-1', name: 'TTS 1 (OPEN AI)' },
            { value: 'tts-1-hd', name: 'TTS 1 HD (OPEN AI)' }
          ]}
        />
      </div>
      )}
      
             <div className='hidden h-full md:flex md:flex-col md:fixed md:w-72 md:inset-y-0 z-[30]
                bg-gray-900'>
                <ChatSidebar selectedChatId={params.chatId} />
            </div>
            <main className='md:pl-72'>
            <ChatBox chatId={params.chatId}  openImageDialog={openImageDialog} openAudioDialog={openAudioDialog}/>
        </main>    
        </div>
    )
}

export default ChatPage;