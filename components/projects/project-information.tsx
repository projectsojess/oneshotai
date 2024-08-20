import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pin, Paperclip, X, Download, Files, Image, Video, FileAudio, FileVideo, Check, Copy, AudioLinesIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PinnedItemsSkeleton } from '../skeletons/projects/pinned-skeleton';
import { FileAttachmentSkeleton } from '../skeletons/projects/files-skeleton';
import { ProjectFileComponent } from './project-file';

interface ProjectInformationProps {
  projectId: string,
  pinnedItems: any[],
  itemsLoading: boolean,
  files: any[]
  attachmentsLoading: boolean
}
const ProjectInformation = ({projectId, pinnedItems, itemsLoading, files, attachmentsLoading}: ProjectInformationProps) => {

  const [pinnedMessages, setPinnedMessages] = useState([]);


  const [copiedId, setCopiedId] = useState(null);


  const handleUnpinMessage = (id) => {
    setPinnedMessages(pinnedMessages.filter(message => message.id !== id));
  };

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
                {itemsLoading && (
                  <PinnedItemsSkeleton />
                )}
                {!itemsLoading && pinnedItems && pinnedItems.length == 0 && (
                   <div className="flex flex-col items-center justify-center h-full">
                   <Pin className="w-12 h-12 mb-4 text-blue-500" />
                   <p className="text-lg font-semibold">No pinned items yet</p>
                    <p className="text-sm mt-2">Pin important messages or files to access them quickly.</p>
                 </div>
                )}
                 {!itemsLoading && pinnedItems && pinnedItems.length !==0 &&  pinnedItems.map((item) => (
                    <Card key={item.id} className="mb-4">
                      <CardContent className="p-4 flex items-start">
                        <div>
                            {getItemIcon(item.type)}
                        </div>
                        <div className="ml-3 flex-grow">
                          <p className="text-sm line-clamp-4">{item.content}</p>
                        </div>
                        <div className="flex ml-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className={`  transition-all duration-200 ${copiedId === item.id ? 'bg-green-600 text-white hover:bg-green-700 hover:text-white' : ''}`}
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
                                className=""
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
            </TabsContent>
            <TabsContent value="attachments" className="mt-0">
              <ScrollArea className="h-[400px] p-4">
                {attachmentsLoading && <FileAttachmentSkeleton />}
              {!attachmentsLoading && files && files.length >0 && files.map((attachment,index) => (
                <ProjectFileComponent 
                    key={index}
                  attachment={attachment}
                
                />
                ))}
              </ScrollArea>

            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default ProjectInformation;