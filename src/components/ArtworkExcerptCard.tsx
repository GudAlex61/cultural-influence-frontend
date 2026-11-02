import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatArtworkDate, type ArtworkExcerpt } from '../artwork_excerpts/artwork_excerpt';
import { ArtworkExcerptMedia } from './ArtworkExcerptMedia';

export function ArtworkExcerptCard({ excerpt }: { excerpt: ArtworkExcerpt }) {
  return (
    <Card as={Link} to={`/artwork_excerpts/feed/${excerpt.id}`} className="artwork-tile"
      aria-label={`Открыть отрывок «${excerpt.artworkTitle}»`}>
      <ArtworkExcerptMedia imageUrl={excerpt.imageUrl} artworkTitle={excerpt.artworkTitle} />
      <Card.Body className="artwork-tile-caption">
        <Card.Title as="h2">{excerpt.artworkTitle}</Card.Title>
        <Card.Text>{formatArtworkDate(excerpt.artworkCreationDate)} <span>{excerpt.citationCount} цит.</span><span>♥ {excerpt.likeCount}</span></Card.Text>
      </Card.Body>
    </Card>
  );
}
