'use client';

import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { CreditCard, LogOut, Settings, User } from 'lucide-react'
import { logout } from '@/actions/signout';
import Link from 'next/link';

const UserCard = () => {

    const  signOut = () => {

        logout();
    }
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='hover:bg-white border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent'>
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56 text-center'>
            <DropdownMenuLabel > My Account</DropdownMenuLabel>
            <DropdownMenuSeparator/>
            <DropdownMenuGroup>
                <DropdownMenuItem>
                    <Link href="/profile" className='flex'>
                    <User className='mr-2 h-4 w-4'/>
                    <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <button onClick={signOut} className='flex'>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </button>
                </DropdownMenuItem>
            </DropdownMenuGroup>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserCard