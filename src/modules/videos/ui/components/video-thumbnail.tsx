import { formatDuration } from "@/lib/utils";
import { Loader } from "lucide-react";
import Image from "next/image"
import { THUMBNAIL_FALLBACK } from "../../constants";


interface VideoThumbnailProps {
    imageUrl?: string | null; 
    previewUrl?: string | null;
     title: string ;
     duration: number;
}






export const VideoThumnail = ({imageUrl, duration, previewUrl, title}: VideoThumbnailProps) => {
    return (
        <div className="relative group">
                <div className="relative w-full overflow-hidden rounded-xl aspect-video">
                    <Image loading="lazy"
                     fill 
                     className=" size-full object-cover group-hover:opacity-0" alt={title} src={imageUrl ? imageUrl :THUMBNAIL_FALLBACK} />
              
              <Image loading="lazy"
              unoptimized={!!previewUrl}
                     fill 
                     className=" size-full object-cover opacity-0 group-hover:opacity-100" alt={title} src={previewUrl ? previewUrl :THUMBNAIL_FALLBACK} />
              
                </div>

                <div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium">
                {formatDuration(duration)}
                </div>
        </div>
    )
}