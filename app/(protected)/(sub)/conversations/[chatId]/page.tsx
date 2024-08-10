'use client';
import AudioDialog from "@/components/audio-generation/audio-dialog";
import ChatBox from "@/components/conversations/chat-box";
import ChatSidebar from "@/components/conversations/chat-sidebar";
import ImageDialog from "@/components/image-generation/image-dialogue";
import { INTERNAL_SERVER_ERROR_MESSAGE } from "@/constants/error-messages";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ChatPage = ({params} : {params : {chatId: string}}) => {

    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
    const [isAudioDialogOpen, setIsAudioDialogOpen] = useState(false);
    const [selectedPrompt, setSelectedPrompt] = useState('');
    const [projectId, setProjectId ] = useState('');

    const [models, setModels ] = useState([]);
    useEffect(() => {

      const getAllModels = async () => {
        try {
        
          const resp = await axios.get("/api/models");
  
          const { data } = resp;
          setModels(data.models);
      } catch (error) {
        
        toast.error(error.response?.data?.message || INTERNAL_SERVER_ERROR_MESSAGE)
      }
      }
      getAllModels();
    },[])

   const openImageDialog = (prompt: string) => {
    setSelectedPrompt(prompt);
    setIsImageDialogOpen(true);
  }

  const openAudioDialog = (prompt: string) => {
    setSelectedPrompt(prompt);
    setIsAudioDialogOpen(true);
  }

  const initializeProjectId = (projectId:string) => {

    setProjectId(projectId);
  }
    return (
        <div className='h-full relative'>
            {isImageDialogOpen && (
        <div className='fixed inset-0 z-50'>
        <ImageDialog
          isOpen={isImageDialogOpen}
          onClose={() => setIsImageDialogOpen(false)}
          prompt={selectedPrompt}
          models={models.filter((model) => model.type ==='IMAGE')}
          chatId={params.chatId}
          projectId=""
        />
      </div>
      )}
      {isAudioDialogOpen && (
        <div className='fixed inset-0 z-50'>
        <AudioDialog
          projectId={projectId}
          chatId={params.chatId}
          isOpen={isAudioDialogOpen}
          onClose={() => setIsAudioDialogOpen(false)}
          prompt={selectedPrompt}
          models={models.filter((model) => model.type ==='AUDIO')}
        />
      </div>
      )}
      
             <div className='hidden h-full md:flex md:flex-col md:fixed md:w-72 md:inset-y-0 z-[30]
                bg-gray-900'>
                <ChatSidebar selectedChatId={params.chatId} />
            </div>
            <main className='md:pl-72'>
            <ChatBox chatId={params.chatId}  openImageDialog={openImageDialog} openAudioDialog={openAudioDialog} initializeProjectId={initializeProjectId}/>
        </main>    
        </div>
    )
}

export default ChatPage;