import { useEffect, useState, type FormEvent } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import { ArtworkExcerptMedia } from '../components/ArtworkExcerptMedia';
import { useArtworkDispatch, useArtworkSelector } from '../store/hooks';
import { createArtworkDraft, loadArtworkDraft, publishArtworkDraft } from '../store/artwork-excerpts.slice';
import { artworkMediaUrl } from '../api/artwork-media-url';

export function ArtworkExcerptDraft() {
  const dispatch = useArtworkDispatch();
  const navigate = useNavigate();
  const user = useArtworkSelector((s) => s.auth.user);
  const { draft, pending } = useArtworkSelector((s) => s.artworkExcerpts);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [citations, setCitations] = useState('');
  const [validation, setValidation] = useState('');
  useEffect(() => { if (user) void dispatch(loadArtworkDraft()); }, [dispatch, user?.id]);
  useEffect(() => {
    setDescription(draft?.shortDescription ?? ''); setDate(draft?.artworkCreationDate ?? '');
    setCitations(draft?.citationCount?.toString() ?? '');
  }, [draft?.id]);
  if (!user) return <Navigate to="/users/login" replace />;

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setValidation('');
    if (!image || !video) return;
    if (image.size > 10485760 || video.size > 52428800 || !image.size || !video.size) {
      setValidation('Выберите непустые файлы: фото до 10,49 МБ, видео до 52,43 МБ.'); return;
    }
    const result = await dispatch(createArtworkDraft({ artworkTitle: title, image, video }));
    if (createArtworkDraft.fulfilled.match(result)) { setImage(null); setVideo(null); setTitle(''); }
  }
  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;
    const result = await dispatch(publishArtworkDraft({ id: draft.id, fields: {
      shortDescription: description, artworkCreationDate: date, citationCount: Number(citations),
    } }));
    if (publishArtworkDraft.fulfilled.match(result)) navigate(`/artwork_excerpts/feed/${result.payload.id}`);
  }
  return <section className="artwork-form-page">
    <p className="artwork-eyebrow">НОВЫЙ ОТРЫВОК</p>
    <h1>{draft ? 'Публикация' : 'Добавление'}</h1>
    {validation && <Alert variant="danger">{validation}</Alert>}
    {!draft ? <Form onSubmit={create}><fieldset disabled={pending > 0}>
      <Form.Group className="mb-3" controlId="artwork-image"><Form.Label>Фото</Form.Label>
        <Form.Control type="file" accept="image/jpeg,image/png,image/webp" required
          onChange={(e) => setImage((e.target as HTMLInputElement).files?.[0] ?? null)} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="artwork-video"><Form.Label>Видео</Form.Label>
        <Form.Control type="file" accept="video/mp4,video/webm" required
          onChange={(e) => setVideo((e.target as HTMLInputElement).files?.[0] ?? null)} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="artwork-title"><Form.Label>Название произведения</Form.Label>
        <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={160} />
      </Form.Group>
      <Button type="submit">Далее</Button>
    </fieldset></Form> : <>
      <h2 className="artwork-draft-title">{draft.artworkTitle}</h2>
      <div className="artwork-draft-media"><ArtworkExcerptMedia key={draft.id} imageUrl={draft.imageUrl}
        videoUrl={draft.videoUrl} artworkTitle={draft.artworkTitle} /></div>
      <video className="artwork-draft-video" controls preload="metadata" aria-label="Видео нового отрывка"
        src={artworkMediaUrl(draft.videoUrl ?? '/media/default-artwork.webm')} />
      <Form onSubmit={publish}><fieldset disabled={pending > 0}>
        <Form.Group className="mb-3" controlId="artwork-description"><Form.Label>Описание отрывка</Form.Label>
          <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} required maxLength={500} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="artwork-date"><Form.Label>Дата создания произведения</Form.Label>
          <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="artwork-citations"><Form.Label>Количество цитирований</Form.Label>
          <Form.Control type="number" min="0" max="2147483647" step="1" value={citations} onChange={(e) => setCitations(e.target.value)} required />
        </Form.Group>
        <Button type="submit">Опубликовать</Button>
      </fieldset></Form>
    </>}
  </section>;
}
