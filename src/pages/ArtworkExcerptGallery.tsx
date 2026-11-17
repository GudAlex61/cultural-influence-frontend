import { useEffect } from 'react';
import { ArtworkCreationDateFilter } from '../components/ArtworkCreationDateFilter';
import { ArtworkExcerptCard } from '../components/ArtworkExcerptCard';
import { useArtworkDispatch, useArtworkSelector } from '../store/hooks';
import { loadArtworkExcerpts, setArtworkFilterInput, applyArtworkFilter, resetArtworkFilter } from '../store/artwork-excerpts.slice';

export function ArtworkExcerptGallery() {
  const dispatch = useArtworkDispatch();
  const { items, filterInput, filterDate, error, pending } = useArtworkSelector((s) => s.artworkExcerpts);
  const userId = useArtworkSelector((s) => s.auth.user?.id);
  useEffect(() => { void dispatch(loadArtworkExcerpts()); }, [dispatch, filterDate, userId]);
  return (
    <section className="artwork-gallery">
      <header><p className="artwork-eyebrow">КОЛЛЕКЦИЯ</p><h1>Отрывки произведений</h1></header>
      <fieldset disabled={pending > 0}>
        <ArtworkCreationDateFilter artworkCreationDate={filterInput}
          onDateChange={(value) => dispatch(setArtworkFilterInput(value))}
          onApply={() => {
            if (filterInput === filterDate) void dispatch(loadArtworkExcerpts());
            else dispatch(applyArtworkFilter());
          }} onReset={() => {
            if (!filterDate) void dispatch(loadArtworkExcerpts());
            dispatch(resetArtworkFilter());
          }} />
      </fieldset>
      <p className="artwork-count" role="status">Найдено отрывков: {items.length}</p>
      {items.length ? <div className="artwork-grid">{items.map((excerpt) => (
        <ArtworkExcerptCard key={excerpt.id} excerpt={excerpt} />
      ))}</div> : !error && !pending && <p className="artwork-empty">На эту дату произведений нет. Измените дату или сбросьте фильтр.</p>}
    </section>
  );
}
