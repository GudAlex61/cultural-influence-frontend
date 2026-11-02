export interface ArtworkExcerpt {
  id: number;
  artworkTitle: string;
  shortDescription: string;
  imageUrl: string | null;
  videoUrl: string | null;
  artworkCreationDate: string | null;
  citationCount: number | null;
  likeCount: number;
}

export function formatArtworkDate(date: string | null): string {
  return date ? date.split('-').reverse().join('.') : 'Не указана';
}
