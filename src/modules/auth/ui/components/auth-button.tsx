"use client";

import { Button } from '@/components/ui/button'
import { Clapperboard, ClapperboardIcon, UserCircleIcon } from 'lucide-react'
import React from 'react'
import {UserButton, SignedIn, SignedOut, SignInButton} from "@clerk/nextjs"


export function Authbutton() {
    //ADD DIFFERENT AUTH STATE
  return (
    <>
<SignedIn>
    <UserButton>
        <UserButton.MenuItems>
             <UserButton.Link
                  label='My Studio'
                  href='/studio'
                  labelIcon={<ClapperboardIcon />}
             />
          
        </UserButton.MenuItems>
    </UserButton>
</SignedIn>

    <SignedOut>
        <SignInButton mode='modal'>
       <Button variant={"outline"} className='px-4 py-2 text-sm text-blue-600 hover:text-blue-500 border-blue-500/20 rounded-full shadow-none'>
           <UserCircleIcon  />
           Sign in
       </Button>
         </SignInButton>
    </SignedOut>   
    </>
  )
}
