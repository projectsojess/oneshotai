'use client'
import CardSkeleton from '@/components/skeletons/projects/card-skeleton'
import CardTile from '@/components/utils/card-tile'
import PageHeader from '@/components/utils/page-header'
import { INTERNAL_SERVER_ERROR_MESSAGE } from '@/constants/error-messages'
import axios from 'axios'
import { Folder, LayoutDashboard } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const DashboardPage = () => {

  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const router = useRouter();
useEffect(() => {

  const getAllProjects = async() => {

    try {
      const resp = await axios.get("/api/projects");

      const { data } = resp;

      setProjects(data.projects);
      setProjectsLoading(false);
    } catch (error) {
      
      toast.error(error.response?.data?.message || INTERNAL_SERVER_ERROR_MESSAGE)
    }
  }

  getAllProjects();
},[])

const onClick = (projectId) => {

  router.push(`/projects/${projectId}`)
}
  return (
    <div>
       <PageHeader
        title='Dashboard'
        description='Comprehensive AI Content Platform'
        icon={LayoutDashboard}
        iconColor='text-sky-500'
        bgColor='bg-sky-500/10'
      />
       <div className='flex items-center mb-2 mx-8'>
        <Folder className='w-7 h-7 mr-2' />
        <h1 className='text-xl'>Recent Projects</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 ml-4">

        <CardTile  isButton={true} />
        { projectsLoading && [1,2].map((item) => (
          <CardSkeleton key={item}/>
        ))}
        {!projectsLoading && projects.map((project) => (
          <CardTile 
            key={project.id}
            isButton={false}
            title={project.name}
            description={project.description}
            handleClick={() => onClick(project.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default DashboardPage
