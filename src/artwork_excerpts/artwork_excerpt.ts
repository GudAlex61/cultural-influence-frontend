export interface ArtworkExcerpt {
  id: number;
  artworkTitle: string;
  shortDescription: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  artworkCreationDate: string | null;
  citationCount: number | null;
  likeCount: number;
  createdAt?: string;
  formationDate?: string | null;
  isOwner?: 0 | 1;
  isLiked?: 0 | 1;
}

export function formatArtworkDate(date: string | null): string {
  return date ? date.split('-').reverse().join('.') : 'Не указана';
}
