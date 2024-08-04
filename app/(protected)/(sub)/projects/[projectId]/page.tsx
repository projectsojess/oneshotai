'use client';
import { INTERNAL_SERVER_ERROR_MESSAGE } from "@/constants/error-messages";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


const ProjectPage = ({params} : {params : {projectId: string}}) => {

    const [project, setProject] = useState(null);

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
    return (
        <div>
          
        </div>
    )
}

export default ProjectPage;