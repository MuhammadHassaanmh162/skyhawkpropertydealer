import { buildEmbedUrl } from '@/lib/utils/youtubeUtils';

interface VideoEmbedProps {
  videoUrl: string | null;
}

function isCloudinaryVideo(url: string) {
  return url.includes('res.cloudinary.com') && url.includes('/video/');
}

export function VideoEmbed({ videoUrl }: VideoEmbedProps) {
  if (!videoUrl) return null;

  const heading = (
    <h3 className="font-bold text-gray-900 text-xl mb-4">Property Video Tour</h3>
  );

  if (isCloudinaryVideo(videoUrl)) {
    return (
      <div className="mt-8">
        {heading}
        <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
          <video
            src={videoUrl}
            controls
            preload="metadata"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }

  const embedUrl = buildEmbedUrl(videoUrl);
  if (!embedUrl) return null;

  return (
    <div className="mt-8">
      {heading}
      <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
        <iframe
          src={embedUrl}
          title="Property Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
