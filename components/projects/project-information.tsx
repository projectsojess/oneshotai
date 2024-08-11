import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pin, Paperclip, Plus, X, Download, Files, Image, FileText, Video, FileAudio, FileVideo, Check, Copy, AudioLinesIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PinnedItemsSkeleton } from '../skeletons/projects/pinned-skeleton';
import { FileAttachmentSkeleton } from '../skeletons/projects/files-skeleton';

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
      case 'IMAGES': return <Image className="w-6 h-6 text-blue-500" />;
      case 'AUDIOS': return <AudioLinesIcon className="w-6 h-6 text-red-500" />;
      case 'VIDEOS': return <Video className="w-6 h-6 text-green-500" />;
      default: return <Paperclip className="w-6 h-6 text-gray-500" />;
    }
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
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
    else return (bytes / 1073741824).toFixed(1) + ' GB';
  };

  const copyToClipboard = (id, content) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

   async function downloadFile(url, filename) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // You might want to show an error message to the user here
    }
  }

  const handleDownload = async (attachment) => {
    await downloadFile(attachment.url, attachment.name);
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
              {!attachmentsLoading && files && files.length >0 && files.map((attachment) => (
        <div key={attachment.id} className="mb-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200 flex items-center shadow-sm hover:shadow-md transition-shadow duration-200">
          {attachment.type === 'IMAGES' ? (
            <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden">
              <img src={attachment.url} alt={attachment.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-indigo-100 rounded">
              {getFileIcon(attachment.type)}
            </div>
          )}
          <div className="flex-grow ml-3">
            <p className="text-sm font-medium text-gray-700">{attachment.name}</p>
            <p className="text-xs text-gray-500">
              {formatFileSize(attachment.metadata.size)} • {new Date(attachment.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mr-1 hover:bg-indigo-200"
                  onClick={() =>  handleDownload(attachment)}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download file</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hover:bg-indigo-200"
                >
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