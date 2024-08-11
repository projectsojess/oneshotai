
'use client';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '@/constants/error-messages';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { Folder, MessageSquare } from 'lucide-react';
import { Montserrat } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { AllChatsSkeleton } from './all-chats-skeleton';

const montserat = Montserrat({
    weight:"600",
    subsets:["latin"]
})

const ChatSidebar = ({selectedChatId} : { selectedChatId :string}) => {
    const router = useRouter();
    const [projects, setProjects] = useState([])
    const [isChatLoading, setChatsLoading] =useState(true);
    useEffect( () => {
 
        const  getAllChats = async () =>{
            try {
                const resp = await axios.get(`/api/conversations`,{
                    params:{chatId: selectedChatId}
                }); 
                const { data } = resp;
                const { chats } = data;
                setProjects(chats);
            } catch (error) {
                toast.error(error.response?.data?.message || INTERNAL_SERVER_ERROR_MESSAGE)
            }finally{
                setChatsLoading(false);
            }
            
        }
        getAllChats();
    },[selectedChatId])

    
  return (
    <div className='w-64 h-screen bg-[#111827] text-white p-4'>
            <Link href='/dashboard' className='flex items-center mb-6'>
                <div className='relative w-8 h-8 mr-4'>
                    <Image
                        fill
                        alt='logo'
                        src="/logo.svg"
                    />
                </div>
                <h1 className={cn('text-xl font-bold', montserat.className)}>OneStopAi</h1>
            </Link>
            {isChatLoading && <AllChatsSkeleton />}
            {!isChatLoading && projects && projects.map((project) => (
                <div key={project.projectId} className="mb-4">
                    <div className="flex items-start mb-2 ">
                            <Link
                                href='#'
                                key={project.projectId}
                                className={cn('flex items-center w-full p-2 rounded-lg transition-colors',
                                )}
                                onClick={(e) => {
                                    e.preventDefault();
                                    router.push(`/projects/${project.projectId}`)
                                }}
                            >
                            <Folder size={18} className="mr-2 mt-1" />
                            <h2 className="text-lg font-semibold">{project.project}</h2>
                            </Link>
                    </div>
                    
                    <div className="space-y-2 ml-4">
                        {project.chats.map((chat) => (
                            <Link
                                href='#'
                                key={chat.id}
                                className={cn('flex items-center w-full p-2 rounded-lg transition-colors',
                                    selectedChatId === chat.id ? "bg-white/10" : "hover:bg-white/10"
                                )}
                                onClick={(e) => {
                                    e.preventDefault();
                                    router.push(`/conversations/${chat.id}`)
                                }}
                            >
                                <MessageSquare size={16} className="mr-2" />
                                <span className="text-sm">{chat.title}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
  )
}

export default ChatSidebar
