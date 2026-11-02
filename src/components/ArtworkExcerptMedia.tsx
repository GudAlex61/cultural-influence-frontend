import { useState } from 'react';

export const DEFAULT_ARTWORK_IMAGE = '/media/default-artwork.svg';
export const DEFAULT_ARTWORK_VIDEO = '/media/default-artwork.webm';

interface ArtworkExcerptMediaProps {
  imageUrl: string | null;
  videoUrl?: string | null;
  artworkTitle: string;
  playVideo?: boolean;
}

export function ArtworkExcerptMedia({ imageUrl, videoUrl, artworkTitle, playVideo = false }: ArtworkExcerptMediaProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const image = imageFailed || !imageUrl?.trim() ? DEFAULT_ARTWORK_IMAGE : imageUrl;
  const video = videoFailed || !videoUrl?.trim() ? DEFAULT_ARTWORK_VIDEO : videoUrl;

  return playVideo ? (
    <video className="artwork-media" src={video} poster={image}
      autoPlay muted loop playsInline preload="metadata"
      aria-label={`Видео отрывка «${artworkTitle}»`}
      onError={() => { if (video !== DEFAULT_ARTWORK_VIDEO) setVideoFailed(true); }} />
  ) : (
    <img className="artwork-media" src={image} alt={artworkTitle} loading="lazy"
      onError={() => { if (image !== DEFAULT_ARTWORK_IMAGE) setImageFailed(true); }} />
  );
}
