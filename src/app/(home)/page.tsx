import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import {HydrateClient, trpc } from '@/trpc/server';
import {HomeView} from "@/modules/home/ui/views/home-view"

 
export const dynamic = "force-dynamic"

interface PageProps {
  searchParams: Promise<{
    categoryId?: string
  }>
}


export default async function Page ({searchParams}: PageProps) {
  const {categoryId} = await searchParams
void await trpc.categories.getMany.prefetch()
  return (
    <HydrateClient>

      <HomeView categoryId={categoryId} />
    
    </HydrateClient>
  );
}