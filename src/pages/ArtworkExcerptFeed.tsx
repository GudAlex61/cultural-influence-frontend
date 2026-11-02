import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { formatArtworkDate, type ArtworkExcerpt } from '../artwork_excerpts/artwork_excerpt';
import { ARTWORK_EXCERPTS_MOCK } from '../artwork_excerpts/artwork_excerpts.mock';
import { ArtworkExcerptMedia } from '../components/ArtworkExcerptMedia';

export function ArtworkExcerptFeed({ excerpts }: { excerpts: readonly ArtworkExcerpt[] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const excerpt = ARTWORK_EXCERPTS_MOCK.find((item) => String(item.id) === id);
  const currentIndex = excerpts.findIndex((item) => String(item.id) === id);
  const nextExcerpt = currentIndex >= 0 ? excerpts[currentIndex + 1] : undefined;

  useEffect(() => {
    setDescriptionExpanded(false);
    document.title = excerpt ? `${excerpt.artworkTitle} — Культурный след` : 'Отрывок не найден — Культурный след';
    return () => { document.title = 'Культурный след — отрывки произведений'; };
  }, [id, excerpt]);

  if (!excerpt) return <section className="artwork-empty"><h1>Отрывок не найден</h1><Link to="/artwork_excerpts">К плитке произведений</Link></section>;

  return (
    <article className="artwork-feed">
      <ArtworkExcerptMedia key={excerpt.id} imageUrl={excerpt.imageUrl} videoUrl={excerpt.videoUrl}
        artworkTitle={excerpt.artworkTitle} playVideo />
      <div className="artwork-shade" />
      <div className="artwork-feed-copy">
        <p className="artwork-eyebrow">ОТРЫВОК ПРОИЗВЕДЕНИЯ</p><h1>{excerpt.artworkTitle}</h1>
        <p className={descriptionExpanded ? 'artwork-description' : 'artwork-description artwork-description-short'}>{excerpt.shortDescription}</p>
        <Button variant="link" className="artwork-more" aria-expanded={descriptionExpanded}
          onClick={() => setDescriptionExpanded(!descriptionExpanded)}>{descriptionExpanded ? 'Меньше' : 'Ещё'}</Button>
      </div>
      <aside className="artwork-feed-actions" aria-label="Параметры отрывка">
        <div><span>Создано</span><strong>{formatArtworkDate(excerpt.artworkCreationDate)}</strong></div>
        <div><span>Цитирований</span><strong>{excerpt.citationCount?.toLocaleString('ru-RU') ?? 'Не указано'}</strong></div>
        <div aria-label={`Отметок нравится: ${excerpt.likeCount}`}><span className="artwork-action-icon">♥</span><strong>{excerpt.likeCount}</strong></div>
        <Button variant="light" disabled={!nextExcerpt} onClick={() => { if (nextExcerpt) navigate(`/artwork_excerpts/feed/${nextExcerpt.id}`); }}>
          <span className="artwork-action-icon">→</span>Далее</Button>
      </aside>
    </article>
  );
}
