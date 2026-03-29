"use client"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { RefreshCw, WifiOff } from "lucide-react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { VideoPlayer } from "../ui/components/video-player";
import { VideoBanner } from "../ui/components/video-banner";
import { VideoTopRow } from "../ui/components/video-top-row";
import { VideoDescription } from "../ui/components/video-description";


interface HomeViewProps {
    videoId: string;
}


export const SuggestionPageSection = ({videoId}: HomeViewProps) => {
  return (
   <Suspense fallback={<p>Loading...</p>}>
       <ErrorBoundary 
        fallbackRender={({ resetErrorBoundary }) => (
          <div className="min-h-[50vh] flex flex-col items-center justify-center gap-6 p-8 text-center border-y bg-muted/40">
            <WifiOff className="h-16 w-16 text-muted-foreground/70" strokeWidth={1.5} />
            
            <div className="space-y-2">
              <h3 className="text-xl font-medium">You're offline</h3>
              <p className="text-muted-foreground max-w-md">
                Check your internet connection and try again. 
                This page requires an active connection to load your videos.
              </p>
            </div>

            <Button 
              variant="outline" 
              size="lg"
              onClick={resetErrorBoundary}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>

            <p className="text-xs text-muted-foreground mt-4">
              If the problem continues, check your network or try again later.
            </p>
          </div>
        )}
       >
           <SuggestionPageSectionSuspense videoId={videoId} />
       </ErrorBoundary>
   </Suspense>
  );
}

export const SuggestionPageSectionSuspense = ({videoId}: HomeViewProps) => {
 // const [video] = trpc.videos.getOne.useSuspenseQuery({id: videoId})
    return (
        <>
  <div>Sugesstions</div>
      </>
  );
}