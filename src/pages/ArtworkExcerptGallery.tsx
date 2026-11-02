import { useState } from 'react';
import { Button } from 'react-bootstrap';
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
  const [artworkPage, setArtworkPage] = useState(0);
  const lastPage = Math.max(0, Math.ceil(excerpts.length / 2) - 1);
  const currentPage = Math.min(artworkPage, lastPage);
  const visibleExcerpts = excerpts.slice(currentPage * 2, currentPage * 2 + 2);

  return (
    <section className="artwork-gallery">
      <header><p className="artwork-eyebrow">КОЛЛЕКЦИЯ</p><h1>Отрывки произведений</h1></header>
      <ArtworkCreationDateFilter {...filterProps}
        onApply={() => { setArtworkPage(0); filterProps.onApply(); }}
        onReset={() => { setArtworkPage(0); filterProps.onReset(); }} />
      <p className="artwork-count" role="status">Найдено отрывков: {excerpts.length}</p>
      {excerpts.length ? <div className="artwork-grid">{visibleExcerpts.map((excerpt) => (
        <ArtworkExcerptCard key={excerpt.id} excerpt={excerpt} />
      ))}</div> : <p className="artwork-empty">На эту дату произведений нет. Измените дату или сбросьте фильтр.</p>}
      {excerpts.length > 2 && <div className="artwork-pagination">
        <Button variant="outline-secondary" disabled={currentPage === 0} onClick={() => setArtworkPage(currentPage - 1)}>Назад</Button>
        <span>{currentPage + 1} / {lastPage + 1}</span>
        <Button disabled={currentPage === lastPage} onClick={() => setArtworkPage(currentPage + 1)}>Далее</Button>
      </div>}
    </section>
  );
}
