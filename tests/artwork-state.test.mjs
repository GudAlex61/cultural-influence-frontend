import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { AxiosError } from 'axios';
import { loadArtworkTestApp } from './load-artwork-test-app.mjs';

const app = await loadArtworkTestApp();
let store;
const row = { id: 1, artworkTitle: 'Отрывок', shortDescription: 'Описание', imageUrl: '/image.jpg',
  videoUrl: '/video.mp4', artworkCreationDate: '1866-01-01', citationCount: 10,
  createdAt: '2026-01-01T00:00:00Z', formationDate: null, likeCount: 0, isLiked: 0, isOwner: 1 };
function unavailable(config, status = 503) {
  return Promise.reject(new AxiosError('Unavailable', 'ERR_BAD_RESPONSE', config, undefined,
    { data: '', status, statusText: 'Unavailable', headers: {}, config }));
}
function response(config, data) { return { status: 200, statusText: 'OK', data, headers: {}, config }; }
beforeEach(() => {
  store = app.createArtworkStore();
  app.artworkApi.instance.defaults.adapter = (config) => unavailable(config);
  app.artworkAuthHttp.defaults.adapter = async (config) => response(config, {});
});

test('guest uses filtered mock only when the service is unavailable', async () => {
  store.dispatch(app.setArtworkFilterInput('1866-01-01')); store.dispatch(app.applyArtworkFilter());
  await store.dispatch(app.loadArtworkExcerpts());
  assert.equal(store.getState().artworkExcerpts.source, 'mock');
  assert.deepEqual(store.getState().artworkExcerpts.items.map((x) => x.id), [1]);
  assert.equal(store.getState().artworkExcerpts.pending, 0);
});

test('an authenticated network failure never substitutes mock', async () => {
  store.dispatch(app.artworkAuthSucceeded({ id: 4, username: 'reader', displayName: 'Reader' }));
  const action = await store.dispatch(app.loadArtworkExcerpts());
  assert.ok(app.loadArtworkExcerpts.rejected.match(action));
  assert.equal(store.getState().artworkExcerpts.source, null);
  assert.deepEqual(store.getState().artworkExcerpts.items, []);
  assert.equal(store.getState().auth.user.id, 4);
});

test('HTTP 404 and application errors are not treated as service unavailability', async () => {
  for (const status of [400, 404, 500]) {
    app.artworkApi.instance.defaults.adapter = (config) => unavailable(config, status);
    const action = await store.dispatch(app.loadArtworkExcerpts());
    assert.ok(app.loadArtworkExcerpts.rejected.match(action));
    assert.notEqual(store.getState().artworkExcerpts.source, 'mock');
  }
});

test('expired session returns UI to guest and clears its filter', async () => {
  store.dispatch(app.artworkAuthSucceeded({ id: 4, username: 'reader', displayName: 'Reader' }));
  store.dispatch(app.setArtworkFilterInput('1866-01-01')); store.dispatch(app.applyArtworkFilter());
  app.artworkApi.instance.defaults.adapter = (config) => unavailable(config, 401);
  await store.dispatch(app.loadArtworkDraft());
  assert.equal(store.getState().auth.user, null);
  assert.equal(store.getState().artworkExcerpts.filterDate, '');
  assert.equal(store.getState().artworkExcerpts.pending, 0);
});

test('generated client puts the calendar date in query parameters', async () => {
  store.dispatch(app.setArtworkFilterInput('1866-01-01')); store.dispatch(app.applyArtworkFilter());
  app.artworkApi.instance.defaults.adapter = async (config) => {
    assert.equal(config.url, '/api/artwork_excerpts');
    assert.equal(config.params.artworkCreationDate, '1866-01-01');
    assert.equal(config.withCredentials, true);
    return response(config, [row]);
  };
  await store.dispatch(app.loadArtworkExcerpts());
  assert.equal(store.getState().artworkExcerpts.source, 'api');
});

test('next feed sends one ID and next=true and receives one record', async () => {
  app.artworkApi.instance.defaults.adapter = async (config) => {
    assert.equal(config.url, '/api/artwork_excerpts/feed/1');
    assert.equal(config.params.next, 'true');
    return response(config, { ...row, id: 7 });
  };
  await store.dispatch(app.loadArtworkFeed({ id: 1, next: true }));
  assert.equal(store.getState().artworkExcerpts.current.id, 7);
});

test('plain Axios logout manually resets auth and Redux filters', async () => {
  store.dispatch(app.artworkAuthSucceeded({ id: 4, username: 'reader', displayName: 'Reader' }));
  store.dispatch(app.setArtworkFilterInput('1866-01-01')); store.dispatch(app.applyArtworkFilter());
  let called = false;
  app.artworkAuthHttp.defaults.adapter = async (config) => {
    assert.equal(config.method, 'post'); assert.equal(config.url, '/sessions/logout');
    called = true; return response(config, '');
  };
  assert.equal(await app.logoutArtworkUser(store.dispatch), true);
  assert.equal(called, true); assert.equal(store.getState().auth.user, null);
  assert.equal(store.getState().artworkExcerpts.filterInput, '');
  assert.equal(store.getState().artworkExcerpts.filterDate, '');
});

test('S3 is proxied but local defaults and mock media stay local', () => {
  assert.equal(app.artworkMediaUrl('http://localhost:9000/artwork-excerpts/image.jpg'), '/s3/artwork-excerpts/image.jpg');
  assert.equal(app.artworkMediaUrl('/media/default-artwork.svg'), '/media/default-artwork.svg');
});

test('stale gallery response cannot overwrite a newer query', async () => {
  let finishFirst;
  app.artworkApi.instance.defaults.adapter = (config) => !config.params?.artworkCreationDate
    ? new Promise((resolve) => { finishFirst = () => resolve(response(config, [row])); })
    : Promise.resolve(response(config, []));
  const first = store.dispatch(app.loadArtworkExcerpts());
  store.dispatch(app.setArtworkFilterInput('1900-01-01')); store.dispatch(app.applyArtworkFilter());
  await store.dispatch(app.loadArtworkExcerpts());
  finishFirst(); await first;
  assert.deepEqual(store.getState().artworkExcerpts.items, []);
});
