import { useState } from 'react';
import { Navigate, Route, Routes, Link } from 'react-router-dom';
import { ARTWORK_EXCERPTS_MOCK } from './artwork_excerpts/artwork_excerpts.mock';
import { ArtworkExcerptNavigation } from './components/ArtworkExcerptNavigation';
import { ArtworkExcerptGallery } from './pages/ArtworkExcerptGallery';
import { ArtworkExcerptFeed } from './pages/ArtworkExcerptFeed';

export function ArtworkExcerptsApp() {
  const [artworkCreationDate, setArtworkCreationDate] = useState('');
  const [appliedArtworkDate, setAppliedArtworkDate] = useState('');
  const excerpts = ARTWORK_EXCERPTS_MOCK.filter((excerpt) =>
    !appliedArtworkDate || excerpt.artworkCreationDate === appliedArtworkDate);

  return (
    <div className="artwork-shell">
      <header className="artwork-brand"><Link to="/artwork_excerpts">КУЛЬТУРНЫЙ СЛЕД</Link><span>ОТРЫВКИ</span></header>
      <main className="artwork-content"><Routes>
        <Route path="/" element={<Navigate to="/artwork_excerpts" replace />} />
        <Route path="/artwork_excerpts" element={<ArtworkExcerptGallery excerpts={excerpts}
          artworkCreationDate={artworkCreationDate} onDateChange={setArtworkCreationDate}
          onApply={() => setAppliedArtworkDate(artworkCreationDate)}
          onReset={() => { setArtworkCreationDate(''); setAppliedArtworkDate(''); }} />} />
        <Route path="/artwork_excerpts/feed/:id" element={<ArtworkExcerptFeed excerpts={excerpts} />} />
        <Route path="*" element={<section className="artwork-empty"><h1>Страница не найдена</h1><Link to="/artwork_excerpts">К плитке произведений</Link></section>} />
      </Routes></main>
      <ArtworkExcerptNavigation firstArtworkId={excerpts[0]?.id} />
    </div>
  );
}
