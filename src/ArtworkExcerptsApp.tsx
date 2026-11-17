import { Alert, Spinner } from 'react-bootstrap';
import { Navigate, Route, Routes, Link, useLocation } from 'react-router-dom';
import { ArtworkExcerptNavigation } from './components/ArtworkExcerptNavigation';
import { ArtworkExcerptGallery } from './pages/ArtworkExcerptGallery';
import { ArtworkExcerptFeed } from './pages/ArtworkExcerptFeed';
import { ArtworkExcerptDraft } from './pages/ArtworkExcerptDraft';
import { ArtworkUserLogin } from './pages/ArtworkUserLogin';
import { useArtworkDispatch, useArtworkSelector } from './store/hooks';
import { clearArtworkError } from './store/artwork-excerpts.slice';

export function ArtworkExcerptsApp() {
  const dispatch = useArtworkDispatch();
  const { pending, error, source } = useArtworkSelector((s) => s.artworkExcerpts);
  const auth = useArtworkSelector((s) => s.auth);
  const { pathname } = useLocation();
  const busy = pending > 0 || auth.loading;
  return (
    <div className="artwork-shell" aria-busy={busy}>
      <header className="artwork-brand"><Link to="/artwork_excerpts">КУЛЬТУРНЫЙ СЛЕД</Link><span>ОТРЫВКИ</span></header>
      <main className="artwork-content">
        {error && <Alert variant="danger" dismissible onClose={() => dispatch(clearArtworkError())}>{error}</Alert>}
        {auth.error && pathname !== '/users/login' && <Alert variant="danger">{auth.error}</Alert>}
        {source === 'mock' && !auth.user && pathname === '/artwork_excerpts' &&
          <p className="artwork-demo-note">Сервис недоступен. Показаны демонстрационные отрывки.</p>}
        <Routes>
          <Route path="/" element={<Navigate to="/artwork_excerpts" replace />} />
          <Route path="/artwork_excerpts" element={<ArtworkExcerptGallery />} />
          <Route path="/artwork_excerpts/feed" element={<ArtworkExcerptFeed />} />
          <Route path="/artwork_excerpts/feed/:id" element={<ArtworkExcerptFeed />} />
          <Route path="/artwork_excerpts/draft" element={<ArtworkExcerptDraft />} />
          <Route path="/users/login" element={<ArtworkUserLogin />} />
          <Route path="*" element={<section className="artwork-empty"><h1>Страница не найдена</h1><Link to="/artwork_excerpts">К плитке произведений</Link></section>} />
        </Routes>
      </main>
      <ArtworkExcerptNavigation />
      {busy && <div className="artwork-loading" role="status" aria-label="Выполняется запрос">
        <Spinner animation="border" /><span>Загрузка…</span>
      </div>}
    </div>
  );
}
