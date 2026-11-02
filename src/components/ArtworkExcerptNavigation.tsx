import { Nav, Navbar } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

export function ArtworkExcerptNavigation({ firstArtworkId }: { firstArtworkId?: number }) {
  const { pathname } = useLocation();
  return (
    <Navbar className="artwork-navigation" aria-label="Основная навигация">
      <Nav>
        {firstArtworkId ? (
          <Nav.Link as={Link} to={`/artwork_excerpts/feed/${firstArtworkId}`}
            active={pathname.includes('/feed/')}><span aria-hidden="true">▶︎</span>Лента</Nav.Link>
        ) : <Nav.Link disabled><span aria-hidden="true">▶︎</span>Лента</Nav.Link>}
        <Nav.Link disabled title="Добавление будет доступно в ЛР6"><span aria-hidden="true">＋</span>Добавление</Nav.Link>
        <Nav.Link as={Link} to="/artwork_excerpts" active={pathname === '/artwork_excerpts'}>
          <span aria-hidden="true">▦</span>Плитка</Nav.Link>
        <Nav.Link disabled title="Вход будет доступен в ЛР6"><span aria-hidden="true">♙</span>Вход</Nav.Link>
      </Nav>
    </Navbar>
  );
}
