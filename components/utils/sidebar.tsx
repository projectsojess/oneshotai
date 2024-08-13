'use client';

import { cn } from '@/lib/utils'
import { AudioLinesIcon,Folder,ImageIcon, LayoutDashboardIcon, MessageSquare, VideoIcon } from 'lucide-react'
import { Montserrat } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react'
import AvailableCredits from '@/components/utils/available-credits';
const montserat = Montserrat({
    weight:"600",
    subsets:["latin"]
})

const routes = [
    {
        label: 'Dashboard',
        icon: LayoutDashboardIcon,
        href: '/dashboard',
        color:'text-sky-500'
    },
    {
        label: 'Projects',
        icon: Folder,
        href: '/projects',
        color:'text-violet-500'
    },
    {
        label: 'Audio Generation',
        icon: AudioLinesIcon,
        href: '/audio-generation',
        color:'text-green-500'
    },
    {
        label: 'Image Generation',
        icon: ImageIcon,
        href: '/image-generation',
        color:'text-red-500'
    },
]


const SideBar = () => {
    const pathname = usePathname();
    
  return (
    <div className='space-y-4 py-4 flex flex-col h-full
     bg-[#111827] text-white'>
        <div className='px-3 py-2 flex-1'>
            <Link href='/dashboard' className='flex items-center pl-3 mb-14'>
                <div className='relative w-8 h-8 mr-4'>
                    <Image
                        fill
                        alt='logo'
                        src="/logo.svg"
                    />
                </div>
                <h1 className={cn('text-2xl font-bold ',montserat.className)}>OneStopAi</h1>
            </Link>
            <div className='space-y-1'>
                {routes.map((route) => (
                    <Link
                        href={route.href}
                        key={route.href}
                        className={cn('text-sm group flex p-3 w-full font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition',
                            pathname == route.href ? "text-white bg-white/10":"text-zinc-400"
                        )}
                    >
                        <div className='flex items-center flex-1'>
                            <route.icon className={cn('h-5 w-5 mr-3',route.color)} />
                            {route.label}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
        <AvailableCredits/>
    </div>
  )
}

export default SideBar