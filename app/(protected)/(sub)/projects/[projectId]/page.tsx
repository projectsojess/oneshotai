'use client';
import ConversationComponent from "@/components/projects/conversation-component";
import ProjectHeader from "@/components/projects/project-header";
import ProjectInformation from "@/components/projects/project-information";
import { Button } from "@/components/ui/button";
import { INTERNAL_SERVER_ERROR_MESSAGE } from "@/constants/error-messages";
import axios from "axios";
import { MessageSquare, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


const ProjectPage = ({params} : {params : {projectId: string}}) => {

    const [project, setProject] = useState(null);
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const router = useRouter();
    const [pinnedItems, setPinnedItems] = useState([]);
    const [files, setFiles ] = useState([]);
    const [itemsLoading, setItemsLoading ] = useState(true);
    const [attachmentsLoading, setAttachmentsLoading] = useState(true);


    useEffect(() => {

        const getProjectData = async () => {
          try {
            const resp = await axios.get(`/api/projects/${params.projectId}`);
            const { data } = resp;
            setProject(data.project);
         } catch (error) {

            toast.error(error.response?.data?.message || INTERNAL_SERVER_ERROR_MESSAGE)
         }
        }
  
        getProjectData();
      },[])

      useEffect(() => {

        const getAllPinnedItems = async() => {
            const projectId = params.projectId
            try {
                const resp = await axios.get("/api/conversations/pinned",{
                    params: {projectId}
                })
                const { data } = resp;
    
                setPinnedItems(data.pinnedItems);
                setItemsLoading(false);
            } catch (error) {
                
                toast.error(error.response?.data?.message || INTERNAL_SERVER_ERROR_MESSAGE)
            }
        }
        getAllPinnedItems();
      },[]);

      useEffect(() => {

        const getAllFiles = async () => {
    
          try {
    
            const resp = await axios.get(`/api/projects/${params.projectId}/files`)
          const { data } = resp;
    
          setFiles(data.files);
            setAttachmentsLoading(false);
          } catch (error) {
            
            toast.error(error.response?.data?.message || INTERNAL_SERVER_ERROR_MESSAGE)
          }
        }
    
        getAllFiles();
      },[])
    return (
      <div className="container mx-auto p-4">
          <div className="mb-8">
            <ProjectHeader projectId={params.projectId}  />
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
            <ConversationComponent projectId={params.projectId}/>
            </div>

        {/* Project Information for larger screens */}
        <div className="hidden lg:block lg:w-1/3">
          <ProjectInformation 
            projectId={params.projectId}
            pinnedItems={pinnedItems}
            itemsLoading={itemsLoading}
            files={files}
            attachmentsLoading={attachmentsLoading}
          />
        </div>

        {/* Drawer-like Project Information for smaller screens */}
        <div className={`lg:hidden fixed inset-y-0 right-0 w-4/5 max-w-sm bg-white shadow-lg transform ${isInfoOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
          <div className="p-4">
            <Button 
              onClick={() => setIsInfoOpen(false)}
              className="mb-4"
              variant="ghost"
              size="icon"
            >
              <X className="h-6 w-6" />
            </Button>
            <ProjectInformation 
                   projectId={params.projectId}
                   pinnedItems={pinnedItems}
                   itemsLoading={itemsLoading}
                   files={files}
                   attachmentsLoading={attachmentsLoading}
            />
          </div>
        </div>

        {/* Button to open drawer on smaller screens */}
        <Button 
          onClick={() => setIsInfoOpen(true)} 
          className="lg:hidden fixed bottom-4 right-4 z-40"
        >
          Project Info
        </Button>
      </div>
      </div>
    )
}

export default ProjectPage;