import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronDown, ChevronUp, Edit, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '@/constants/error-messages';
import axios from 'axios';
import ProjectHeaderSkeleton from '../skeletons/projects/project-header-skeleton';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { cn } from '@/lib/utils';

const ProjectHeader = ({ projectId }) => {
    const [loading, setLoading] = useState(false);
  const [ headerLoading, setHeaderLoading ] = useState(true);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [tempTitle, setTempTitle] = useState(projectTitle);
  const [tempDescription, setTempDescription] = useState(projectDescription);

  const handleSaveTitle = async() => {
        setLoading(true)
    try {
         await axios.put(`/api/projects/${projectId}`,{
            title: tempTitle
        });

        setProjectTitle(tempTitle);
        setIsEditingTitle(false);
    } catch (error) {
        
        toast.error(error.response?.data?.message || INTERNAL_SERVER_ERROR_MESSAGE)
    }finally{
        setLoading(false)
    }
  };

  const handleSaveDescription = async() => {
    setLoading(true)
    try {
        await axios.put(`/api/projects/${projectId}`,{
           title: tempTitle
       });

       setProjectDescription(tempDescription);
       setIsEditingDescription(false);
   } catch (error) {
       
       toast.error(error.response?.data?.message || INTERNAL_SERVER_ERROR_MESSAGE)
   }finally{
    setLoading(false)
}
  };

  const handleCancelTitle = () => {
    setTempTitle(projectTitle);
    setIsEditingTitle(false);
  };

  const handleCancelDescription = () => {
    setTempDescription(projectDescription);
    setIsEditingDescription(false);
  };

  useEffect( () => {

   const getProjectDetails = async() => {

    try {
        const resp = await axios.get(`/api/projects/${projectId}`)
        const { data } = resp;

        setProjectTitle(data.project.name);
        setProjectDescription(data.project.description);
        setHeaderLoading(false);

    } catch (error) {
        
        toast.error(error.response?.data?.message || INTERNAL_SERVER_ERROR_MESSAGE)
    }
   }

   getProjectDetails();
  },[])
  return (
    headerLoading ? (
        <ProjectHeaderSkeleton />
    ): (
        <div className="mb-6">
      {isEditingTitle ? (
        <div className="relative mb-2">
          <Input 
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            className="text-2xl font-bold pr-20 border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
            autoFocus
          />
          <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex space-x-1">
            <Button onClick={handleCancelTitle} size="sm" variant="ghost" className='hover:bg-red-500/20'>
              <X className='w-4 h-4'/>
            </Button>
            <Button onClick={handleSaveTitle} size="sm" variant='ghost' className='hover:bg-green-500/20'>
              <Check className='text-green-500 w-4 h-4'/><AiOutlineLoading3Quarters className={cn(!loading ?  "hidden" : "block animate-spin ml-2")}/>
            </Button>
          </div>
        </div>
      ) : (
        <h1 className="text-2xl font-bold mb-2 flex items-center bg-gradient-to-r from-sky-500 to-indigo-600 p-2 rounded-t-lg text-white">
          {projectTitle}
          <Button variant="ghost" size="sm" onClick={() => setIsEditingTitle(true)} className="ml-2">
            <Edit className="w-4 h-4" />
          </Button>
        </h1>
      )}
      <div className="relative border rounded-md p-2">
        {isEditingDescription ? (
          <div className="relative">
            <Textarea
              value={tempDescription}
              onChange={(e) => setTempDescription(e.target.value)}
              className="text-sm  pr-20 border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
              rows={4}
              autoFocus
            />
            <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex space-x-1">
            <Button onClick={handleCancelDescription} size="sm" variant="ghost" className='hover:bg-red-500/20'>
              <X className='w-4 h-4'/>
            </Button>
            <Button onClick={handleSaveDescription} size="sm" variant='ghost' className='hover:bg-green-500/20'>
              <Check className='text-green-500 w-4 h-4'/><AiOutlineLoading3Quarters className={cn(!loading ?  "hidden" : "block animate-spin ml-2")}/>
            </Button>
          </div>
          </div>
        ) : (
          <>
            <p className={`text-sm text-gray-600 mb-2 ${isDescriptionExpanded ? '' : 'line-clamp-2'}`}>
              {projectDescription}
            </p>
            <div className="flex justify-between items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="p-1"
              >
                {isDescriptionExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsEditingDescription(true)}
                className="p-1"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
    )
  );
};

export default ProjectHeader;