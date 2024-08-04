'use client'
import CardTile from '@/components/utils/card-tile'
import PageHeader from '@/components/utils/page-header'
import { Folder, LayoutDashboard } from 'lucide-react'
import React from 'react'

const DashboardPage = () => {

  const openProjectPopup = () => {

  }
  return (
    <div>
       <PageHeader
        title='Dashboard'
        description='Comprehensive AI Content Platform'
        icon={LayoutDashboard}
        iconColor='text-black-500'
        bgColor='bg-black-500/10'
      />
       <div className='flex items-center mb-2 mx-8'>
        <Folder className='w-7 h-7 mr-2' />
        <h1 className='text-xl'>Recent Projects</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 ml-4">

        <CardTile  isButton={true} onClick={openProjectPopup}/>
        
      </div>
    </div>
  )
}

export default DashboardPage
