import { Nav, Navbar } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useArtworkDispatch, useArtworkSelector } from '../store/hooks';
import { logoutArtworkUser } from '../api/artwork-auth';

export function ArtworkExcerptNavigation() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useArtworkDispatch();
  const user = useArtworkSelector((s) => s.auth.user);
  const busy = useArtworkSelector((s) => s.auth.loading || s.artworkExcerpts.pending > 0);
  return (
    <Navbar className="artwork-navigation" aria-label="Основная навигация">
      <Nav>
        <Nav.Link as={Link} to="/artwork_excerpts/feed" disabled={busy}
          active={pathname.includes('/feed')}><span aria-hidden="true">▶︎</span>Лента</Nav.Link>
        <Nav.Link as={Link} to="/artwork_excerpts/draft" disabled={!user || busy}
          active={pathname.includes('/draft')}><span aria-hidden="true">＋</span>Добавление</Nav.Link>
        <Nav.Link as={Link} to="/artwork_excerpts" disabled={busy} active={pathname === '/artwork_excerpts'}>
          <span aria-hidden="true">▦</span>Плитка</Nav.Link>
        {user ? <Nav.Link as="button" disabled={busy} onClick={async () => {
          if (await logoutArtworkUser(dispatch)) navigate('/artwork_excerpts');
        }}><span aria-hidden="true">♙</span>Выход</Nav.Link> :
          <Nav.Link as={Link} to="/users/login" disabled={busy} active={pathname === '/users/login'}>
            <span aria-hidden="true">♙</span>Вход</Nav.Link>}
      </Nav>
    </Navbar>
  );
}
