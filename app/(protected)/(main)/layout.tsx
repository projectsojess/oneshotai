import NavBar from '@/components/utils/nav-bar'
import SideBar from '@/components/utils/sidebar'
import React from 'react'

const DashboardLayout = async ({
    children
}: {
    children: React.ReactNode
}) => {
  return (
    <div className='h-full relative'>
        <div className='hidden h-full md:flex md:flex-col md:fixed md:w-72 md:inset-y-0 
        bg-gray-900'>
            <SideBar/>
        </div>
        <main className='md:pl-72'>
            <NavBar/>
            {children}
        </main>
    </div>
  )
}

export default DashboardLayout