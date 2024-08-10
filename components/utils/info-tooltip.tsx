'use client';
import React from 'react'
import { BsInfoCircle } from 'react-icons/bs';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider } from '../ui/tooltip';
import { TooltipTrigger } from '@radix-ui/react-tooltip';
const InfoTooltip = ({ info }: {info : string}) => {
  return (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger>
            <Button variant='ghost' className='hover:bg-white'>
                <BsInfoCircle/>
            </Button>
            </TooltipTrigger>

            <TooltipContent className=' w-[50vh] font-normal italic text-xs'>
                <p>{info}</p>
            </TooltipContent>
        </Tooltip>

    </TooltipProvider>
  )
}

export default InfoTooltip
