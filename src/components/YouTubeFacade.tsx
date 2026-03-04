import { useState } from "react";
import { Play } from "lucide-react";

interface YouTubeFacadeProps {
  videoId: string;
  title?: string;
  className?: string;
}

export function YouTubeFacade({ videoId, title = "YouTube video player", className = "" }: YouTubeFacadeProps) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        className={`w-full h-full ${className}`}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  }

  return (
    <button
      onClick={() => setLoaded(true)}
      className={`relative w-full h-full bg-black group cursor-pointer ${className}`}
      aria-label={`Play: ${title}`}
    >
      <img
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt={title}
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
      />
      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600 flex items-center justify-center group-hover:bg-red-700 transition-colors shadow-2xl">
          <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white ml-1" />
        </div>
      </div>
    </button>
  );
}
