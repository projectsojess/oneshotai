import React, { useEffect, useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pin, Files, X, Copy, Image, FileAudio, FileVideo, Check, Info } from 'lucide-react';

const ChatDrawer = ({pinnedItems } : {pinnedItems: any[]}) => {
  const [activeTab, setActiveTab] = useState('pinned');
  const [copiedId, setCopiedId] = useState(null);

  const attachments = [
    { id: 1, type: 'image', name: 'mockup.png', size: '2.4 MB', date: '2023-07-28' },
    { id: 2, type: 'pdf', name: 'project_brief.pdf', size: '1.2 MB', date: '2023-07-30' },
    { id: 3, type: 'video', name: 'demo.mp4', size: '15.7 MB', date: '2023-08-02' },
  ];

  const getItemIcon = (type) => {
    switch(type) {
      case 'message': return <Pin className="w-5 h-5 text-blue-400" />;
      case 'audio': return <FileAudio className="w-5 h-5 text-green-400" />;
      case 'image': return <Image className="w-5 h-5 text-purple-400" />;
      case 'video': return <FileVideo className="w-5 h-5 text-red-400" />;
      default: return <Pin className="w-5 h-5 text-blue-400" />;
    }
  };

  const copyToClipboard = (id, content) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <TooltipProvider>
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="fixed right-6 bottom-20 z-40 rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-800 border-gray-700 text-gray-200"
          >
            <Info />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-gray-900 text-gray-200 p-4">
          <DrawerHeader className="border-b border-gray-800">
            <DrawerTitle className="text-xl font-semibold">Chat Information</DrawerTitle>
          </DrawerHeader>
          <div className="flex h-[500px]">
            <div className="w-1/4 border-r border-gray-800">
              <Button 
                variant={activeTab === 'pinned' ? 'secondary' : 'ghost'}
                onClick={() => setActiveTab('pinned')}
                className="w-full justify-start py-6 text-left"
              >
                <Pin className="w-5 h-5 mr-2" />
                Pinned
              </Button>
              <Button 
                variant={activeTab === 'files' ? 'secondary' : 'ghost'}
                onClick={() => setActiveTab('files')}
                className="w-full justify-start py-6 text-left"
              >
                <Files className="w-5 h-5 mr-2" />
                Files
              </Button>
            </div>
            <div className="w-3/4">
              {activeTab === 'pinned' && (
                <ScrollArea className="h-full p-4">
                  {pinnedItems &&  pinnedItems.map((item) => (
                    <Card key={item.id} className="mb-4 bg-gray-800 border-gray-700">
                      <CardContent className="p-4 flex items-start">
                        <div>
                            {getItemIcon(item.type)}
                        </div>
                        <div className="ml-3 flex-grow">
                          <p className="text-sm text-gray-300 line-clamp-4">{item.content}</p>
                        </div>
                        <div className="flex ml-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className={`text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition-all duration-200 ${copiedId === item.id ? 'bg-green-600 text-white hover:bg-green-700 hover:text-white' : ''}`}
                                onClick={() => copyToClipboard(item.id, item.content)}
                              >
                                {copiedId === item.id ? (
                                  <>
                                    <Check className="w-4 h-4 mr-1" />
                                    <span className="text-xs">Copied</span>
                                  </>
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{copiedId === item.id ? "Copied!" : "Copy content"}</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Unpin item</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </ScrollArea>
              )}
              {activeTab === 'files' && (
                <ScrollArea className="h-full p-4">
                  {attachments.map((attachment) => (
                    <Card key={attachment.id} className="mb-4 bg-gray-800 border-gray-700">
                      <CardContent className="p-4 flex items-center">
                        {getItemIcon(attachment.type)}
                        <div className="flex-grow ml-3">
                          <p className="text-sm font-medium text-gray-300">{attachment.name}</p>
                          <p className="text-xs text-gray-400">{attachment.size} • {attachment.date}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </ScrollArea>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </TooltipProvider>
  );
};

export default ChatDrawer;