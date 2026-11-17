import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { formatArtworkDate } from '../artwork_excerpts/artwork_excerpt';
import { ArtworkExcerptMedia } from '../components/ArtworkExcerptMedia';
import { useArtworkDispatch, useArtworkSelector } from '../store/hooks';
import { loadArtworkFeed, likeArtworkExcerpt, deleteArtworkExcerpt } from '../store/artwork-excerpts.slice';

export function ArtworkExcerptFeed() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useArtworkDispatch();
  const user = useArtworkSelector((s) => s.auth.user);
  const { current: excerpt, pending, viewerId, error, source } = useArtworkSelector((s) => s.artworkExcerpts);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  useEffect(() => {
    if (id && excerpt?.id === Number(id) && viewerId === (user?.id ?? null)) return;
    void dispatch(loadArtworkFeed({ id: id === undefined ? undefined : Number(id) }));
  }, [dispatch, id, user?.id]);
  useEffect(() => {
    setDescriptionExpanded(false);
    document.title = excerpt ? `${excerpt.artworkTitle} — Культурный след` : 'Культурный след';
    return () => { document.title = 'Культурный след — отрывки произведений'; };
  }, [excerpt?.id]);
  if (!excerpt) return <section className="artwork-empty">
    <h1>{pending ? 'Загрузка отрывка…' : error ? 'Отрывок недоступен' : 'Отрывок не найден'}</h1>
    <Link to="/artwork_excerpts">К плитке произведений</Link>
  </section>;
  async function next() {
    if (!excerpt) return;
    const result = await dispatch(loadArtworkFeed({ id: excerpt.id, next: true }));
    if (loadArtworkFeed.fulfilled.match(result)) navigate(`/artwork_excerpts/feed/${result.payload.excerpt.id}`);
  }
  return (
    <article className="artwork-feed">
      <ArtworkExcerptMedia key={excerpt.id} imageUrl={excerpt.imageUrl} videoUrl={excerpt.videoUrl}
        artworkTitle={excerpt.artworkTitle} playVideo />
      <div className="artwork-shade" />
      <div className="artwork-feed-copy">
        <p className="artwork-eyebrow">{source === 'mock' ? 'ДЕМОНСТРАЦИОННЫЙ ОТРЫВОК' : 'ОТРЫВОК ПРОИЗВЕДЕНИЯ'}</p><h1>{excerpt.artworkTitle}</h1>
        <p className={descriptionExpanded ? 'artwork-description' : 'artwork-description artwork-description-short'}>{excerpt.shortDescription}</p>
        <Button variant="link" className="artwork-more" aria-expanded={descriptionExpanded}
          onClick={() => setDescriptionExpanded(!descriptionExpanded)}>{descriptionExpanded ? 'Меньше' : 'Ещё'}</Button>
      </div>
      <aside className="artwork-feed-actions" aria-label="Параметры отрывка">
        <div><span>Создано</span><strong>{formatArtworkDate(excerpt.artworkCreationDate)}</strong></div>
        <div><span>Цитирований</span><strong>{excerpt.citationCount?.toLocaleString('ru-RU') ?? 'Не указано'}</strong></div>
        {user ? <Button variant="light" disabled={pending > 0} aria-label="Нравится" aria-pressed={excerpt.isLiked === 1}
          onClick={() => { void dispatch(likeArtworkExcerpt({ id: excerpt.id, liked: excerpt.isLiked === 1 ? 0 : 1 })); }}>
          <span className="artwork-action-icon">♥</span><strong>{excerpt.likeCount}</strong>
        </Button> : <div aria-label={`Отметок нравится: ${excerpt.likeCount}`}><span className="artwork-action-icon">♥</span><strong>{excerpt.likeCount}</strong></div>}
        <Button variant="light" disabled={pending > 0} onClick={() => { void next(); }}>
          <span className="artwork-action-icon">→</span>Далее</Button>
        {user && excerpt.isOwner === 1 && <Button disabled={pending > 0} onClick={async () => {
          const result = await dispatch(deleteArtworkExcerpt(excerpt.id));
          if (deleteArtworkExcerpt.fulfilled.match(result)) navigate('/artwork_excerpts');
        }}>Удалить</Button>}
      </aside>
    </article>
  );
}
