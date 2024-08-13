'use client';
import * as z from 'zod';
import {  AudioLinesIcon, Copy, ImageIcon, MoreVertical, PinIcon, Send, User } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import axios from 'axios';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { ChatPromptSchema } from '@/schemas/validation/chat-prompt-schema';
import toast from 'react-hot-toast';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '@/constants/error-messages';
import { MessageRenderer } from './message-renderer';
import ChatDrawer from './chat-drawer';
import MessageListSkeleton from '../skeletons/conversations/message-list-skeleton';
import { Plan } from '@/types/plan';
import { getUserPlanClient } from '@/hooks/use-user';
import { Badge } from '../ui/badge';
import { useProModal } from '@/hooks/use-pro-modal';

 
interface Message {
  id: string,
  role: string,
  content: string,
  project_id: string,
  chat_pinned: boolean,
  project_pinned: boolean
}
interface ChatBoxProps {
  chatId: string;
  openImageDialog: (prompt: string, plan:string) => void;
  openAudioDialog: (prompt: string,plan: string) => void;
  initializeProjectId: (projectId: string) => void;
}


const ChatBox = ({ chatId, openImageDialog, openAudioDialog,initializeProjectId} : ChatBoxProps) => {

  const [pinnedItems, setPinnedItems ] = useState([]);
  const [plan, setPlan] = useState<Plan>(null);
  const proModal = useProModal();

  useEffect(() => {

    const getAllPinnedItems = async() => {

        try {
            const resp = await axios.get("/api/conversations/pinned",{
                params: {chatId}
            })
            const { data } = resp;

            setPinnedItems(data.pinnedItems);
        } catch (error) {
            
            toast.error(error.response?.data?.message || INTERNAL_SERVER_ERROR_MESSAGE)
        }
    }
    getAllPinnedItems();
  },[]);

  const removePinnedItem = (id) => {
    setPinnedItems(pinnedItems.filter(item => item.id !== id));
  };

  const addPinnedItem = (newItem) => {
    setPinnedItems([...pinnedItems, newItem]);
  };

  const updateMessagePinnedStatus = (
    messageId: string,
    chatPinned: boolean,
    projectPinned: boolean
  ) => {
    setMessages(prevMessages => 
      prevMessages.map(message => 
        message.id === messageId 
          ? { ...message, chat_pinned: chatPinned, project_pinned: projectPinned }
          : message
      )
    );
  };
  const pinMessage = async (id: string, chat:boolean, project:boolean, updatePin: boolean)=> {

    if(plan.plan !=='PREMIUM'){

      proModal.onOpen();
      return;
    }
    try {
        const resp = await axios.put("/api/conversations/pinned",{
          messageId : id,
          project,
          chat
        });

        const { data } = resp;

        if(updatePin){
          addPinnedItem(data.pinnedItem);
        }
        updateMessagePinnedStatus(id,chat,project);
        toast.success(`Message pinned successfully.`);
        
    } catch (error) {
      
      toast.error(error.response?.data?.message || INTERNAL_SERVER_ERROR_MESSAGE)
    }
  }

  const form = useForm<z.infer<typeof ChatPromptSchema>>({
    resolver: zodResolver(ChatPromptSchema),
    defaultValues: {
      prompt:""
    }
  })

    const isLoading = form.formState.isSubmitting;

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages ] = useState<any[]>([]);
    const [messagesLoading, setMessagesLoading] = useState(true);
    useEffect(() => {

      const getAllMessages = async () => {
        try {
          const plan: Plan = await getUserPlanClient();
          setPlan(plan);

          const resp = await axios.get(`/api/conversations/${chatId}`);
          const { data } = resp;
          setMessages(data.messages);
          initializeProjectId(data.messages[0].project_id)
          setMessagesLoading(false);
       } catch (error: any) {

        toast.error(error.response?.data?.message || INTERNAL_SERVER_ERROR_MESSAGE);
       }
      }
      getAllMessages();
    },[])
    const scrollToBottom = () => {

        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      };
    
      useEffect(scrollToBottom, [messages]);


      const onSubmit = async (values : z.infer<typeof ChatPromptSchema>) => {
        try {
          const newUserMessage = {
            role: 'user',
            content: values.prompt
          };

          const resp = await axios.post("/api/conversations/messages", {
            messages : [...messages, newUserMessage ],
            chatId : chatId,
            model: messages[0].model,
            projectId: messages[0].project_id
          });
          const { data } = resp;
          setMessages( prevMessages => prevMessages.concat(data.messages));
          form.reset();
        } catch (error) {

          toast.error(error.response?.data?.message || INTERNAL_SERVER_ERROR_MESSAGE)
        }
      }
      const copyToClipboard = async (content: string) => {
        try {
          await navigator.clipboard.writeText(content);
          toast.success("Message copied to clipboard.")
        } catch (err) {
          toast.error("Failed to copy to clipboard");
        }
      };

  return (
    <div className="flex h-screen bg-gray-100">
         <div className="flex-1 flex flex-col">
        {/* Chat area */}
        <div className="flex-1 p-4 overflow-y-auto ml-5 mr-5">
          {messagesLoading && <MessageListSkeleton />}
        {!messagesLoading &&  messages &&  messages.map((message: Message) => (
            <div key={message.id} className={`flex ${message.role === 'assistant' ? 'justify-end' : 'justify-start'} mb-4`}>
              <div className={`flex items-start ${message.role === 'assistant' ? 'flex-row-reverse' : ''} max-w-[80%]`}>
                <div className={`rounded-full p-2 flex-shrink-0`}>
                  {message.role === 'user' ? <User size={24} className="text-gray-900 bg-muted" /> : 
                    <div className='w-10 h-10 relative'>
                      <Image alt='logo' fill src='/logo.svg' />
                    </div>}
                </div>
                <div className={`mx-2 p-4 rounded-lg relative ${message.role === 'user' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900 border border-gray-300 '} inline-block`}>
                <MessageRenderer content={message.content} />
                  {message.role == 'assistant' && (
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 absolute top-1 right-1 hover:bg-gray-800 hover:text-white">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!message.chat_pinned && (
                        <DropdownMenuItem>
                        <Button 
                        variant='ghost'
                        onClick={() => pinMessage(message.id,true,message.project_pinned,true)}
                        >
                          <PinIcon className="mr-2 h-4 w-4 text-blue-500"/>
                          <span>Pin to Chat</span>
                          {plan.plan !== 'PREMIUM' && <Badge variant='premium' className='ml-2'> PREMIUM</Badge>}
                        </Button>
                      </DropdownMenuItem>
                      )}
                      {!message.project_pinned && (
                        <DropdownMenuItem>
                        <Button 
                        variant='ghost'
                        onClick={() => pinMessage(message.id,message.chat_pinned,true,false)}
                        >
                          <PinIcon className="mr-2 h-4 w-4 text-yellow-500"/>
                          <span>Pin to Project</span>
                          {plan.plan !== 'PREMIUM' && <Badge variant='premium' className='ml-2'> PREMIUM</Badge>}
                        </Button>
                      </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <Button 
                        variant='ghost'
                        onClick={() => openImageDialog(message.content, plan.plan)}
                        >
                          <ImageIcon className="mr-2 h-4 w-4 text-red-500"/><span> Generate Image</span>
                          {plan.plan === 'FREE' && <Badge variant='premium' className='ml-2'> PRO</Badge>}
                        </Button>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Button 
                        variant='ghost'
                        onClick={() => openAudioDialog(message.content,plan.plan)}
                        >
                          <AudioLinesIcon className="mr-2 h-4 w-4 text-green-500"/><span> Generate Audio</span>
                          {plan.plan === 'FREE' && <Badge variant='premium' className='ml-2'> PRO</Badge>}
                        </Button>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Button 
                        variant='ghost'
                        onClick={() => copyToClipboard(message.content)}
                        >
                          <Copy className="mr-2 h-4 w-4 text-black"/><span>Copy Content</span>
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
          <ChatDrawer pinnedItems={pinnedItems} plan={plan?.plan}/>
        </div>
        <div className="p-4 border-t bg-gray-100">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex space-x-2">
              <FormField
                name='prompt'
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input

                        className="w-full"
                        disabled={isLoading}
                        placeholder="Type your message..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button disabled={isLoading} variant="outline" className='bg-gray-900 text-white hover:bg-gray-700'>
                <Send size={20} />
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default ChatBox