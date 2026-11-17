import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatArtworkDate, type ArtworkExcerpt } from '../artwork_excerpts/artwork_excerpt';
import { ArtworkExcerptMedia } from './ArtworkExcerptMedia';
import { useArtworkDispatch, useArtworkSelector } from '../store/hooks';
import { deleteArtworkExcerpt } from '../store/artwork-excerpts.slice';

export function ArtworkExcerptCard({ excerpt }: { excerpt: ArtworkExcerpt }) {
  const dispatch = useArtworkDispatch();
  const user = useArtworkSelector((s) => s.auth.user);
  const busy = useArtworkSelector((s) => s.artworkExcerpts.pending > 0);
  return (
    <Card className="artwork-tile">
      <Link to={`/artwork_excerpts/feed/${excerpt.id}`} className="artwork-tile-link"
        aria-label={`Открыть отрывок «${excerpt.artworkTitle}»`}>
        <ArtworkExcerptMedia imageUrl={excerpt.imageUrl} artworkTitle={excerpt.artworkTitle} />
        <Card.Body className="artwork-tile-caption">
          <Card.Title as="h2">{excerpt.artworkTitle}</Card.Title>
          <Card.Text>{formatArtworkDate(excerpt.artworkCreationDate)} <span>{excerpt.citationCount} цит.</span><span>♥ {excerpt.likeCount}</span></Card.Text>
        </Card.Body>
      </Link>
      {user && excerpt.isOwner === 1 && <Button className="artwork-delete" disabled={busy}
        onClick={() => { void dispatch(deleteArtworkExcerpt(excerpt.id)); }}>Удалить</Button>}
    </Card>
  );
}
