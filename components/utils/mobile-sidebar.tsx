'use client';

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import SideBar from '@/components/utils/sidebar';

const MobileSidebar = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    },[]);

    if(!isMounted){
        return null;
    }
  return (
    <Sheet>
        <SheetTrigger>
            <Button variant='ghost' size='icon' className='md:hidden'>
                <Menu />
            </Button>
        </SheetTrigger>
        <SheetContent side='left' className='p-0'>
            <SideBar availableCredits={1000} totalCredits={1000} plan='FREE'/>
        </SheetContent>
    </Sheet>
  )
}

export default MobileSidebar
