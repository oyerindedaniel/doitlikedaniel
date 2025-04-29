"use client";

interface YoutubeEmbedProps {
  id: string;
  title?: string;
}

export function YoutubeEmbed({
  id,
  title = "YouTube video",
}: YoutubeEmbedProps) {
  return (
    <div className="my-4 aspect-video overflow-hidden rounded-sm">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube.com/embed/${id}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}
