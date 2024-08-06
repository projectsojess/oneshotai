'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { MessageCircle, Calendar, ChevronRight, History } from "lucide-react";
import PromptInput from "../conversations/prompt-input";
import toast from "react-hot-toast";
import { INTERNAL_SERVER_ERROR_MESSAGE } from "@/constants/error-messages";
import axios from "axios";
interface ConversationComponentProps {
  projectId: string
}
const ConversationComponent = ({ projectId }: ConversationComponentProps) => {
  const [models, setModels ] = useState([]);
  const [modelsLoading, setModelsLoading ] = useState(true);
  const [conversations, setConversations] = useState([
    {
      title: 'Project Kickoff Meeting',
      preview: 'Discussing initial project requirements and timeline.',
      date: '2023-08-15',
      unread: true,
    },
    {
      title: 'UI/UX Design Review',
      preview: 'Feedback on the latest mockups for the dashboard.',
      date: '2023-08-17',
      unread: false,
    },
    {
      title: 'Backend Architecture Discussion',
      preview: 'Finalizing the database schema and API endpoints.',
      date: '2023-08-20',
      unread: true,
    },
  ]);

  useEffect(() => {

    const getTextModels = async () => {
      try {
      
        const resp = await axios.get("/api/models/TEXT");

        const { data } = resp;
        setModels(data.models);
        setModelsLoading(false);
    } catch (error) {
      
      toast.error(error.response?.data?.message || INTERNAL_SERVER_ERROR_MESSAGE)
    }
    }

    getTextModels();
  },[])
  return (
    <Card className="lg:col-span-3 border-0 shadow-md">
      <CardHeader className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center text-2xl">
          <MessageCircle className="mr-2" />
          Conversations
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <PromptInput models={models} projectId={projectId}/>
        <div className="mt-14 flex ml-7 text-xl">
            <History className="w-6 h-6 mr-2" /> Recent Conversations
        </div>
        <ScrollArea className="h-[500px] p-4">
          {conversations.map((conversation, index) => (
            <div 
              key={index} 
              className="mb-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-gray-800">{conversation.title}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">{conversation.preview}</p>
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {conversation.date}
                </span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default ConversationComponent;