'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { MessageCircle, Calendar, ChevronRight } from "lucide-react";

const ConversationComponent = () => {
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

  return (
    <Card className="lg:col-span-3 border-0 shadow-md">
      <CardHeader className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center text-2xl">
          <MessageCircle className="mr-2" />
          Topics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
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