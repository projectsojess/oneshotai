'use client';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import React from 'react'
interface HeaderProps{
 title: string,
 description: string,
 icon: LucideIcon,
 iconColor: string
 bgColor?: string
}
const PageHeader = ({
    title,
    description,
    icon: Icon,
    iconColor,
    bgColor
}: HeaderProps) => {
  return (
    <div>
      <div className='px-4 lg:px-8 flex items-center gap-x-3 mb-8'>
        <div className={cn('p-2 w-ft rounded-md',bgColor)}>
            <Icon className={cn("w-10 h-10",iconColor)}/>
        </div>
        <div>
        <h2 className='text-3xl font-bold'>{title}</h2>
        <p>{description}</p>
      </div>
      </div>
    </div>
  )
}

export default PageHeader
