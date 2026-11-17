import { createAsyncThunk, createSlice, isAnyOf, type Dispatch, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';
import type { ArtworkExcerpt } from '../artwork_excerpts/artwork_excerpt';
import type { PublishArtworkExcerptDto } from '../api/generated/ArtworkExcerptsApi';
import { ARTWORK_EXCERPTS_MOCK } from '../artwork_excerpts/artwork_excerpts.mock';
import { artworkApi } from '../api';
import { artworkRequestError, isArtworkServiceUnavailable, type ArtworkRequestError } from '../api/artwork-errors';
import { artworkSessionExpired, artworkSignedOut } from './auth.slice';

interface ArtworkExcerptsState {
  filterInput: string;
  filterDate: string;
  items: ArtworkExcerpt[];
  current: ArtworkExcerpt | null;
  draft: ArtworkExcerpt | null;
  source: 'api' | 'mock' | null;
  viewerId: number | null;
  pending: number;
  error: string | null;
  listRequestId: string | null;
  feedRequestId: string | null;
}
const initialState: ArtworkExcerptsState = {
  filterInput: '', filterDate: '', items: [], current: null, draft: null,
  source: null, viewerId: null, pending: 0, error: null,
  listRequestId: null, feedRequestId: null,
};
type ThunkConfig = { state: RootState; rejectValue: ArtworkRequestError };

function failure(error: unknown, dispatch: Dispatch): ArtworkRequestError {
  const result = artworkRequestError(error);
  if (result.status === 401) dispatch(artworkSessionExpired());
  return result;
}

export const loadArtworkExcerpts = createAsyncThunk<
  { items: ArtworkExcerpt[]; source: 'api' | 'mock' }, void, ThunkConfig
>('artworkExcerpts/load', async (_, { getState, dispatch, rejectWithValue, signal }) => {
  const state = getState();
  const date = state.artworkExcerpts.filterDate;
  try {
    const response = await artworkApi.artworkExcerpts.artworkExcerptsControllerGetPublished(
      date ? { artworkCreationDate: date } : {}, { signal },
    );
    return { items: response.data, source: 'api' };
  } catch (error) {
    if (!state.auth.user && isArtworkServiceUnavailable(error)) {
      return { items: ARTWORK_EXCERPTS_MOCK.filter((x) => !date || x.artworkCreationDate === date), source: 'mock' };
    }
    return rejectWithValue(failure(error, dispatch));
  }
});

export const loadArtworkFeed = createAsyncThunk<
  { excerpt: ArtworkExcerpt; source: 'api' | 'mock'; viewerId: number | null },
  { id?: number; next?: boolean }, ThunkConfig
>('artworkExcerpts/feed', async ({ id, next = false }, { getState, dispatch, rejectWithValue, signal }) => {
  const user = getState().auth.user;
  try {
    const response = id === undefined
      ? await artworkApi.artworkExcerpts.artworkExcerptsControllerGetFirstFeed({ signal })
      : await artworkApi.artworkExcerpts.artworkExcerptsControllerGetFeed({ id, ...(next ? { next: 'true' } : {}) }, { signal });
    return { excerpt: response.data, source: 'api', viewerId: user?.id ?? null };
  } catch (error) {
    if (!user && isArtworkServiceUnavailable(error)) {
      let index = id === undefined ? 0 : ARTWORK_EXCERPTS_MOCK.findIndex((x) => x.id === id);
      if (index < 0) return rejectWithValue({ status: 404, message: 'Отрывок не найден.' });
      if (next) index = (index + 1) % ARTWORK_EXCERPTS_MOCK.length;
      return { excerpt: ARTWORK_EXCERPTS_MOCK[index], source: 'mock', viewerId: null };
    }
    return rejectWithValue(failure(error, dispatch));
  }
});

export const loadArtworkDraft = createAsyncThunk<ArtworkExcerpt | null, void, ThunkConfig>(
  'artworkExcerpts/draft', async (_, { dispatch, rejectWithValue }) => {
    try { return (await artworkApi.artworkExcerpts.artworkExcerptsControllerGetDraft()).data; }
    catch (error) {
      if (artworkRequestError(error).status === 404) return null;
      return rejectWithValue(failure(error, dispatch));
    }
  },
);

export const createArtworkDraft = createAsyncThunk<ArtworkExcerpt,
  { artworkTitle: string; image: File; video: File }, ThunkConfig>(
  'artworkExcerpts/create', async (input, { dispatch, rejectWithValue }) => {
    try { return (await artworkApi.artworkExcerpts.artworkExcerptsControllerCreateDraft(input)).data; }
    catch (error) { return rejectWithValue(failure(error, dispatch)); }
  },
);

export const publishArtworkDraft = createAsyncThunk<
  ArtworkExcerpt, { id: number; fields: PublishArtworkExcerptDto }, ThunkConfig
>('artworkExcerpts/publish', async ({ id, fields }, { dispatch, rejectWithValue }) => {
  try { return (await artworkApi.artworkExcerpts.artworkExcerptsControllerPublish({ id }, fields)).data; }
  catch (error) { return rejectWithValue(failure(error, dispatch)); }
});

export const likeArtworkExcerpt = createAsyncThunk<ArtworkExcerpt,
  { id: number; liked: 0 | 1 }, ThunkConfig>(
  'artworkExcerpts/like', async ({ id, liked }, { dispatch, rejectWithValue }) => {
    try { return (await artworkApi.artworkExcerpts.artworkExcerptsControllerSetLike({ id }, { liked })).data; }
    catch (error) { return rejectWithValue(failure(error, dispatch)); }
  },
);

export const deleteArtworkExcerpt = createAsyncThunk<number, number, ThunkConfig>(
  'artworkExcerpts/delete', async (id, { dispatch, rejectWithValue }) => {
    try { await artworkApi.artworkExcerpts.artworkExcerptsControllerDelete({ id }); return id; }
    catch (error) { return rejectWithValue(failure(error, dispatch)); }
  },
);

const requests = [loadArtworkExcerpts, loadArtworkFeed, loadArtworkDraft,
  createArtworkDraft, publishArtworkDraft, likeArtworkExcerpt, deleteArtworkExcerpt] as const;
const artworkExcerptsSlice = createSlice({
  name: 'artworkExcerpts', initialState,
  reducers: {
    setArtworkFilterInput(state, action: PayloadAction<string>) { state.filterInput = action.payload; },
    applyArtworkFilter(state) { state.filterDate = state.filterInput; },
    resetArtworkFilter(state) { state.filterDate = ''; state.filterInput = ''; },
    clearArtworkError(state) { state.error = null; },
  },
  extraReducers(builder) {
    builder
      .addCase(artworkSignedOut, () => ({ ...initialState }))
      .addCase(artworkSessionExpired, () => ({ ...initialState }))
      .addCase(loadArtworkExcerpts.pending, (state, action) => { state.listRequestId = action.meta.requestId; })
      .addCase(loadArtworkExcerpts.fulfilled, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return;
        state.items = action.payload.items; state.source = action.payload.source;
      })
      .addCase(loadArtworkFeed.pending, (state, action) => { state.feedRequestId = action.meta.requestId; })
      .addCase(loadArtworkFeed.fulfilled, (state, action) => {
        if (state.feedRequestId !== action.meta.requestId) return;
        state.current = action.payload.excerpt; state.source = action.payload.source;
        state.viewerId = action.payload.viewerId;
      })
      .addCase(loadArtworkFeed.rejected, (state, action) => {
        if (state.feedRequestId === action.meta.requestId && !action.meta.aborted) state.current = null;
      })
      .addCase(loadArtworkDraft.fulfilled, (state, action) => { state.draft = action.payload; })
      .addCase(createArtworkDraft.fulfilled, (state, action) => { state.draft = action.payload; })
      .addCase(publishArtworkDraft.fulfilled, (state, action) => {
        state.draft = null; state.current = action.payload; state.source = 'api';
      })
      .addCase(likeArtworkExcerpt.fulfilled, (state, action) => {
        const index = state.items.findIndex((x) => x.id === action.payload.id);
        if (index >= 0) state.items[index] = action.payload;
        if (state.current?.id === action.payload.id) state.current = action.payload;
      })
      .addCase(deleteArtworkExcerpt.fulfilled, (state, action) => {
        state.items = state.items.filter((x) => x.id !== action.payload);
        if (state.current?.id === action.payload) state.current = null;
      })
      .addMatcher(isAnyOf(...requests.map((r) => r.pending)), (state) => {
        state.pending++; state.error = null;
      })
      .addMatcher(isAnyOf(...requests.map((r) => r.fulfilled)), (state) => { state.pending = Math.max(0, state.pending - 1); })
      .addMatcher(isAnyOf(...requests.map((r) => r.rejected)), (state, action) => {
        state.pending = Math.max(0, state.pending - 1);
        if (!action.meta.aborted) state.error = (action.payload as ArtworkRequestError | undefined)?.message ?? 'Не удалось выполнить запрос.';
      });
  },
});
export const { setArtworkFilterInput, applyArtworkFilter, resetArtworkFilter, clearArtworkError } = artworkExcerptsSlice.actions;
export default artworkExcerptsSlice.reducer;
