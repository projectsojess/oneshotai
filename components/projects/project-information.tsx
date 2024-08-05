import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pin, Paperclip, Plus, X, Download, Files, Image, FileText, Video } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ProjectInformation = () => {
  const [pinnedMessages, setPinnedMessages] = useState([
    { id: 1, content: "Remember to update the API documentation", author: "John Doe", date: "2023-08-01", important: true },
    { id: 2, content: "Client meeting scheduled for next Tuesday", author: "Jane Smith", date: "2023-08-03", important: false },
  ]);

  const [attachments, setAttachments] = useState([
    { id: 1, type: 'image', name: 'mockup.png', size: '2.4 MB', date: '2023-07-28', url: '/api/placeholder/100/100' },
    { id: 2, type: 'pdf', name: 'project_brief.pdf', size: '1.2 MB', date: '2023-07-30', url: '#' },
    { id: 3, type: 'video', name: 'demo.mp4', size: '15.7 MB', date: '2023-08-02', url: '/api/placeholder/100/100' },
  ]);

  const handleUnpinMessage = (id) => {
    setPinnedMessages(pinnedMessages.filter(message => message.id !== id));
  };

  const handleAddAttachment = () => {
    console.log("Adding new attachment");
  };

  const handleRemoveAttachment = (id) => {
    setAttachments(attachments.filter(attachment => attachment.id !== id));
  };

  const getFileIcon = (type) => {
    switch(type) {
      case 'image': return <Image className="w-6 h-6 text-blue-500" />;
      case 'pdf': return <FileText className="w-6 h-6 text-red-500" />;
      case 'video': return <Video className="w-6 h-6 text-green-500" />;
      default: return <Paperclip className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <TooltipProvider>
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center text-xl">
            <Files className="w-5 h-5 mr-2" />
            Project Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="pinned" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pinned" className="data-[state=active]:bg-purple-100">
                <Pin className="w-4 h-4 mr-2" />
                Pinned
              </TabsTrigger>
              <TabsTrigger value="attachments" className="data-[state=active]:bg-indigo-100">
                <Files className="w-4 h-4 mr-2" />
                Files
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pinned" className="mt-0">
              <ScrollArea className="h-[400px] p-4">
                {pinnedMessages.map((message) => (
                  <div key={message.id} className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <p className="text-sm mb-2 text-gray-700">{message.content}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span className="flex items-center">
                        <Badge variant={message.important ? "destructive" : "secondary"} className="mr-2">
                          {message.important ? "Important" : "Info"}
                        </Badge>
                        {message.author} • {message.date}
                      </span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => handleUnpinMessage(message.id)} className="hover:bg-purple-200">
                            <X className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Unpin message</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="attachments" className="mt-0">
              <ScrollArea className="h-[400px] p-4">
                {attachments.map((attachment) => (
                  <div key={attachment.id} className="mb-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200 flex items-center shadow-sm hover:shadow-md transition-shadow duration-200">
                    {getFileIcon(attachment.type)}
                    <div className="flex-grow ml-3">
                      <p className="text-sm font-medium text-gray-700">{attachment.name}</p>
                      <p className="text-xs text-gray-500">{attachment.size} • {attachment.date}</p>
                    </div>
                    <div className="flex">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="mr-1 hover:bg-indigo-200">
                            <Download className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Download file</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveAttachment(attachment.id)} className="hover:bg-indigo-200">
                            <X className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Remove file</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </ScrollArea>
              <div className="p-4 border-t border-gray-200">
                <Button onClick={handleAddAttachment} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New File
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default ProjectInformation;