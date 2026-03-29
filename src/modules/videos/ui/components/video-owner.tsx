import Link from "next/link";
import { VideoGetOneOutput } from "../../types"
import { UserAvatar } from "@/components/user-avatar";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { SubscriptionButton } from "@/modules/subscription/ui/components/suscription-button";
import { UserInfo } from "@/modules/users/ui/components/user-info";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface VideoOwnerProps{
    user: VideoGetOneOutput['user']
    videoId: string;
}


export const VideoOwner = ({user, videoId}: VideoOwnerProps) => {
 const {userId: clerkUserId} = useAuth()
    return (
    <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 min.w-0">
       <Link href={`/users/${user.id}`} >
           <div className="flex items-center gap-3 min-w-0">
             <UserAvatar size={"lg"} imageUrl={user.imageUrl} name={user.name} />
             <div className="flex flex-col gap-1 min-w-0">

                 <p className="text-base font-medium text-black line-clamp-1 hover:text-gray-800">
                                           {user.name}
                                     </p>
                  
             <span className="text-sm text-muted-foreground line-clamp-1">
                {0} subscribers
             </span>

             </div>
           </div>
       </Link>
       {
         clerkUserId === user.clerkId ? (
            <Button
            variant={"secondary"}
            className="rounded-full"
            asChild
            >
                <Link href={`/studio/videos/${videoId}`}>
                Edit Video
                </Link>
            </Button>
         ) :
         (
           <SubscriptionButton
           onClick={() => {}}
           className="flex"
           disabled={false}
           isSubscribed={false}
           />
         )
       }
    </div>
  )
}
