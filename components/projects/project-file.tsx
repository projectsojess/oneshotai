import { AudioLines, Download, Image, Loader2, Paperclip, Video, X } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useState } from "react";
import { cn } from "@/lib/utils";

export const ProjectFileComponent = ({attachment, isChat=false }) => {

    const [isDownloading, setIsDownloading] = useState(false);

    const getFileIcon = (type) => {
      switch(type) {
        case 'IMAGE': return <Image className="w-6 h-6 text-blue-500" />;
        case 'AUDIO': return <AudioLines className="w-6 h-6 text-red-500" />;
        case 'VIDEO': return <Video className="w-6 h-6 text-green-500" />;
        default: return <Paperclip className="w-6 h-6 text-gray-500" />;
      }
    };
  
    const formatFileSize = (bytes) => {
      if (bytes < 1024) return bytes + ' B';
      else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
      else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
      else return (bytes / 1073741824).toFixed(1) + ' GB';
    };
  
    const downloadFile = async (url, filename) => {
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
    };
  
    const handleDownload = async () => {
      setIsDownloading(true);
      await downloadFile(attachment.public_url, attachment.filename);
      setIsDownloading(false);
    };
  
    return (
<div className={cn("mb-4 p-4  rounded-lg border  flex items-center shadow-sm hover:shadow-md transition-shadow duration-200",
  isChat ? "bg-gray-800 border-gray-700" : "bg-indigo-50 border-indigo-200"
)}>
      {attachment.type === 'IMAGE' ? (
        <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden">
          <img src={attachment.public_url} alt={attachment.filename} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className={cn("w-16 h-16 flex-shrink-0 flex items-center justify-center  rounded",
          isChat? 'bg-gray-800' : 'bg-indigo-100'
        )}>
          {getFileIcon(attachment.type)}
        </div>
      )}
      <div className="flex-grow ml-3">
        <p className={cn("text-sm font-medium ", isChat ? 'text-gray-300' : 'text-gray-700')}>{attachment.filename}</p>
        <p className={cn("text-xs ", isChat ? 'text-gray-300': 'text-gray-500')}>
          {formatFileSize(attachment.size_bytes)} • {new Date(attachment.created_at).toLocaleDateString()}
        </p>
      </div>
      <div className="flex">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn("mr-1 ", isChat ? 'hover:bg-gray-900': 'hover:bg-indigo-200')}
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isDownloading ? 'Downloading...' : 'Download file'}</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn( isChat ? 'hover:bg-gray-900': 'hover:bg-indigo-200')}
            //   onClick={() => onRemove(attachment.id)}
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
    );
}