
import { ResponsiveModal } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { UploadDropzone } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface PlayListCreateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}
 const formSchema = z.object({
    name: z.string().min(1),
       videoId: z.string()
   }) 
    
export const PlayListCreateModal = ({
videoId,
open,
onOpenChange
}: PlayListCreateModalProps) =>{
  const utils = trpc.useUtils()
   
const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:{
        name: ""
    }
})

const Create = trpc.playList.creat.useMutation({
    onSuccess() {
        toast.success("Playlist created successfully")
      utils.playList.getPlayList.invalidate();
        form.reset()
        onOpenChange(false)
    },
    onError() {
        toast.error("somerthing went wrong")
    },
})

const onSubmit = (value: z.infer<typeof formSchema>)  =>  {
    Create.mutate(value)
}
return(
    <ResponsiveModal
    title="Create a playlist"
    open={open}
    onOpenChange={onOpenChange}
    >
        
       <Form {...form}>
            <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}>
            <FormField 
            control={form.control}
            name="name"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Enter playlist name</FormLabel>
                    <FormControl>
                        <Input 
                        {...field}
                        className="My favourite vidoes"
                        />

                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
            />
            <div className="flex justify-end">
                <Button
                disabled={Create.isPending}
                type="submit"
                >
                 Create
                </Button>
            </div>
            </form>
       </Form>
    </ResponsiveModal>
)

}