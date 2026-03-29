"use client"

import { ResponsiveModal } from "@/components/responsive-dialog"
import { Button } from "@/components/ui/button"
import { trpc } from "@/trpc/client"
import { Loader2Icon, PlusIcon } from "lucide-react"
import { toast } from "sonner"
import { StudioUploader } from "./studio-uploader"
import { useRouter } from "next/navigation"

export const StudioUploadModal = () => {
      const utils = trpc.useUtils()
      const router = useRouter()
   const create = trpc.videos.create.useMutation({
    onSuccess: () => {
        toast.success("Commencing video creation")
        utils.studio.getMany.invalidate();
    },
    onError: (error) => {
        toast.error(`❌ Failed to create. Poor internet connection!`)
      
    }
   })
 

   const onSucess = () =>{
       if(!create.data?.video.id) return;

       create.reset()
        toast.loading("Redirecting for further video modification")
        router.push(`/studio/videos/${create.data.video.id}`)
   }

  return (
  <>
  <ResponsiveModal 
  title="Upload a video"
  open= {!!create.data?.url}
  onOpenChange={() => create.reset()}
  >
   {create.data?.url ? <StudioUploader onSucess={onSucess} enpoint={create.data?.url}
     />: <Loader2Icon className="animate-spin" /> }
    </ResponsiveModal>
   {create.isPending && <Button variant="secondary"
 disabled={true}
     > <Loader2Icon className="animate-spin" /> Creating...
    </Button>}

     {!create.isPending &&  <Button variant="secondary"
 onClick={() => create.mutate()}
 disabled={false}
     >
    <PlusIcon />
        Create
    </Button>}
  </>
  )
}
