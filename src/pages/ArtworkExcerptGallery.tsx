import type { ArtworkExcerpt } from '../artwork_excerpts/artwork_excerpt';
import { ArtworkCreationDateFilter } from '../components/ArtworkCreationDateFilter';
import { ArtworkExcerptCard } from '../components/ArtworkExcerptCard';

interface ArtworkExcerptGalleryProps {
  excerpts: readonly ArtworkExcerpt[];
  artworkCreationDate: string;
  onDateChange: (date: string) => void;
  onApply: () => void;
  onReset: () => void;
}

export function ArtworkExcerptGallery({ excerpts, ...filterProps }: ArtworkExcerptGalleryProps) {
  return (
    <section className="artwork-gallery">
      <header><p className="artwork-eyebrow">КОЛЛЕКЦИЯ</p><h1>Отрывки произведений</h1></header>
      <ArtworkCreationDateFilter {...filterProps} />
      <p className="artwork-count" role="status">Найдено отрывков: {excerpts.length}</p>
      {excerpts.length ? <div className="artwork-grid">{excerpts.map((excerpt) => (
        <ArtworkExcerptCard key={excerpt.id} excerpt={excerpt} />
      ))}</div> : <p className="artwork-empty">На эту дату произведений нет. Измените дату или сбросьте фильтр.</p>}
    </section>
  );
}
