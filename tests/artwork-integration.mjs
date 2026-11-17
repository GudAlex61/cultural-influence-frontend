import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import axios from 'axios';
import { loadArtworkTestApp } from './load-artwork-test-app.mjs';

// Uses only a newly registered test account and its own soft-deleted excerpt.
const app = await loadArtworkTestApp();
const origin = process.env.ARTWORK_FRONTEND_URL ?? 'http://127.0.0.1:3000';
app.artworkApi.instance.defaults.baseURL = origin;
app.artworkAuthHttp.defaults.baseURL = `${origin}/api`;
let cookie = '';
app.artworkAuthHttp.interceptors.response.use((response) => {
  const header = response.headers['set-cookie']?.[0];
  if (header) {
    cookie = header.split(';')[0];
    app.artworkApi.instance.defaults.headers.Cookie = cookie;
    app.artworkAuthHttp.defaults.headers.Cookie = cookie;
  }
  return response;
});
const store = app.createArtworkStore();
const credentials = { username: `lr6_test_${Date.now()}`, displayName: 'Проверка ЛР6', password: 'ArtworkTest2026!' };
let excerptId;
async function dispatch(thunk) { return store.dispatch(thunk).unwrap(); }
try {
  assert.equal(await app.registerArtworkUser(credentials, store.dispatch), true);
  assert.ok(cookie.startsWith('sessionId='));
  assert.ok(store.getState().auth.user.id > 0);
  console.log('PASS registration and plain Axios login through /api proxy');

  assert.equal(await dispatch(app.loadArtworkDraft()), null);
  const draft = await dispatch(app.createArtworkDraft({
    artworkTitle: 'Проверка культурного следа',
    image: new File([await readFile('public/media/crime-and-punishment.jpg')], 'artwork.jpg', { type: 'image/jpeg' }),
    video: new File([await readFile('public/media/crime-and-punishment.mp4')], 'artwork.mp4', { type: 'video/mp4' }),
  }));
  excerptId = draft.id;
  assert.equal(draft.shortDescription, null);
  assert.equal(draft.isOwner, 1);
  assert.match(draft.imageUrl, /^http:\/\/localhost:9000\/artwork-excerpts\//);
  assert.equal((await dispatch(app.loadArtworkDraft())).id, excerptId);
  const image = await axios.get(`${origin}${app.artworkMediaUrl(draft.imageUrl)}`, { responseType: 'arraybuffer' });
  assert.equal(image.status, 200);
  assert.equal(image.data.byteLength, (await readFile('public/media/crime-and-punishment.jpg')).byteLength);
  const video = await axios.get(`${origin}${app.artworkMediaUrl(draft.videoUrl)}`, { responseType: 'arraybuffer' });
  assert.equal(video.status, 200);
  console.log('PASS multipart creation, own draft and actual image/video through /s3 proxy');

  const published = await dispatch(app.publishArtworkDraft({ id: excerptId, fields: {
    shortDescription: 'Тест публикации через сгенерированный клиент.', artworkCreationDate: '1866-01-01', citationCount: 166,
  } }));
  assert.deepEqual(Object.keys(draft).sort(), Object.keys(published).sort());
  store.dispatch(app.setArtworkFilterInput('1866-01-01')); store.dispatch(app.applyArtworkFilter());
  const result = await dispatch(app.loadArtworkExcerpts());
  assert.ok(result.items.some((x) => x.id === excerptId));
  assert.ok(result.items.every((x) => x.artworkCreationDate === '1866-01-01'));
  assert.equal(result.source, 'api');
  const first = await dispatch(app.loadArtworkFeed({}));
  assert.equal(Array.isArray(first.excerpt), false);
  const selected = await dispatch(app.loadArtworkFeed({ id: excerptId }));
  assert.equal(selected.excerpt.id, excerptId);
  const next = await dispatch(app.loadArtworkFeed({ id: excerptId, next: true }));
  assert.ok(next.excerpt.id > 0);
  console.log('PASS publication, stable JSON keys, SQL date filter and single-record feed');

  const liked = await dispatch(app.likeArtworkExcerpt({ id: excerptId, liked: 1 }));
  assert.equal(liked.isLiked, 1);
  const repeated = await dispatch(app.likeArtworkExcerpt({ id: excerptId, liked: 1 }));
  assert.equal(repeated.likeCount, liked.likeCount);
  const unliked = await dispatch(app.likeArtworkExcerpt({ id: excerptId, liked: 0 }));
  assert.equal(unliked.isLiked, 0);
  assert.equal(unliked.likeCount, liked.likeCount - 1);
  const other = axios.create({ baseURL: `${origin}/api` });
  await other.post('/users', { ...credentials, username: `${credentials.username}_other` });
  const otherLogin = await other.post('/sessions', { username: `${credentials.username}_other`, password: credentials.password });
  const denied = await other.delete(`/artwork_excerpts/${excerptId}`, { headers: { Cookie: otherLogin.headers['set-cookie'][0].split(';')[0] }, validateStatus: () => true });
  assert.equal(denied.status, 404);
  const freshPage = app.createArtworkStore();
  assert.equal(freshPage.getState().auth.user, null);
  const sameCookie = await axios.get(`${origin}/api/artwork_excerpts`, { headers: { Cookie: cookie } });
  assert.equal(sameCookie.data.find((x) => x.id === excerptId).isOwner, 1);
  console.log('PASS F5-equivalent new Redux store is guest while the unchanged cookie still authenticates API');
  await other.post('/sessions/logout', undefined, { headers: { Cookie: otherLogin.headers['set-cookie'][0].split(';')[0] } });
  await dispatch(app.deleteArtworkExcerpt(excerptId));
  excerptId = undefined;
  await assert.rejects(dispatch(app.loadArtworkFeed({ id: published.id })), (error) => error.status === 404);
  assert.equal(await app.logoutArtworkUser(store.dispatch), true);
  assert.equal(store.getState().auth.user, null);
  assert.equal(store.getState().artworkExcerpts.filterDate, '');
  const guestDraft = await axios.get(`${origin}/api/artwork_excerpts/draft`, { validateStatus: () => true });
  assert.equal(guestDraft.status, 401);
  console.log('PASS idempotent likes, foreign deletion denied, own logical deletion, logout and guest restriction');
} finally {
  if (excerptId) await app.artworkApi.artworkExcerpts.artworkExcerptsControllerDelete({ id: excerptId }).catch(() => {});
  if (store.getState().auth.user) await app.logoutArtworkUser(store.dispatch);
}
