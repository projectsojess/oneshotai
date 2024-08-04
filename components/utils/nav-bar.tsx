import React from 'react'
import UserCard from './user-card';
import MobileSidebar from '@/components/utils/mobile-sidebar';
const NavBar = () => {
  return (
    <div className='flex items-center p-4'>
        <MobileSidebar/>
        <div className='flex w-full justify-end'>
          <UserCard/>
        </div>
    </div>
  )
}

export default NavBar