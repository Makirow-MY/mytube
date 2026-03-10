"use client";

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar";
import { FlameIcon, HistoryIcon, HomeIcon, ListVideoIcon, PlaySquareIcon, ThumbsUpIcon } from "lucide-react";
import Link from "next/link";
import {useClerk, useAuth} from "@clerk/nextjs";

const items = [
    {
        title:  "History",
        url: "/playlists/history",
        icon: HistoryIcon,
        auth:true,
    },
    {
        title:  "Liked Videos",
        url: "/playlists/liked",
        icon: ThumbsUpIcon,
        auth: true,
    },
    {
        title:  "All Playlists",
        url: "/playlists",
        icon: ListVideoIcon,
        auth: true,
    },

]

export const   PersonalSection = () => {
        const clerk = useClerk();
        const {isSignedIn} = useAuth();
    
    return (
        <SidebarGroup>
            <SidebarGroupLabel>You</SidebarGroupLabel> 
            <SidebarGroupContent>
                <SidebarMenu>

                         {items.map((item) => (
                    <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    key={item.title}
                    isActive={false} // change to look on pathname
                    onClick={(e) => { 
                         if(item.auth && !isSignedIn){
                            e.preventDefault();
                          return clerk.openSignIn();
                        }}} // add navigation logic here
                    > 
                        <Link href={item.url} className="flex items-center gap-4">
                            <item.icon className="size-5" />
                            <span className="text-sm">{item.title}</span>
                        </Link>
                    </SidebarMenuButton>
                ))}

                </SidebarMenu>
                
            </SidebarGroupContent>
        </SidebarGroup>    
    );
}