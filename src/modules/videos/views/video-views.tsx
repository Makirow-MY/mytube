import { Suspense } from "react";
import { CategoriesSectionn } from "../../home/ui/sections/categories-section";
import { VideoPageSection } from "../sections/video-section";
import { SuggestionPageSection } from "../sections/sugestion-section";
import { CommentsPageSection } from "../sections/comments-section";



interface VideoPageViewProps {
    videoId: string;
}


export const VideoPageView = ({videoId}: VideoPageViewProps) => {
  return (
    <div className="max-w-[1700px] mx-auto mb-10 px-4 pt-2.5 flex flex-col">
  
  <div className="flex flex-col lg:flex-row gap-6">
     <div className="flex-1 min-w-0">
          <VideoPageSection videoId={videoId} />
          <div className="lg:hidden block mt-4">
           <SuggestionPageSection videoId={videoId} />
          </div>
          <CommentsPageSection videoId={videoId} />
     </div>
          <div className="hidden lg:block w-full lg:w-[300px] xl:w-[450px] shrink-1">
           <SuggestionPageSection videoId={videoId} />
          </div>
   </div>
       
    </div>
  );
}