import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import {HydrateClient, trpc } from '@/trpc/server';
import {HomeView} from "@/modules/home/ui/views/home-view"
import { VideoPageView } from '@/modules/videos/views/video-views';

 
export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{
    videoId: string
  }>
}


export default async function Page ({params}: PageProps) {
  const {videoId} = await params
void await trpc.videos.getOne.prefetch({id: videoId})
  return (
   <HydrateClient>

      <VideoPageView videoId={videoId} />
    
    </HydrateClient>
  );
}