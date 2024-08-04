import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { BackButton } from '@/components/auth/back-button';
import { Socials } from '@/components/auth/socials';
 
interface CardWrapperProps {
    children: React.ReactNode,
    headerLabel: string,
    backButtonLabel:string,
    backButtonHref:string,
    showSocial:boolean
}
const CardWrapper = ({
    children,
    headerLabel,
    backButtonLabel,
    backButtonHref,
    showSocial
} :  CardWrapperProps ) => {
  return (
    <Card className='w-[400px] shadow-md'>
        <CardHeader>
            <div className='w-full flex flex-col gap-y-4 items-center justify-center'>
                <h1 className='text-3xl font-semibold'>{headerLabel}</h1>
            </div>
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
       {showSocial &&  <CardFooter>
            <Socials/>
        </CardFooter>}
        <CardFooter>
            <BackButton href={backButtonHref} label={backButtonLabel}/>
        </CardFooter>
    </Card>
  )
}

export default CardWrapper