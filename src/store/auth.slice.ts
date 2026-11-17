import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ArtworkUser { id: number; username: string; displayName: string }
interface ArtworkAuthState {
  user: ArtworkUser | null;
  loading: boolean;
  error: string | null;
}

// A reload intentionally starts the UI as a guest. HttpOnly-cookie is not persisted into Redux.
const initialState: ArtworkAuthState = { user: null, loading: false, error: null };
const artworkAuthSlice = createSlice({
  name: 'artworkAuth', initialState,
  reducers: {
    artworkAuthStarted(state) { state.loading = true; state.error = null; },
    artworkAuthSucceeded(state, action: PayloadAction<ArtworkUser>) {
      state.user = action.payload; state.loading = false; state.error = null;
    },
    artworkAuthFailed(state, action: PayloadAction<string>) {
      state.loading = false; state.error = action.payload;
    },
    artworkSignedOut: () => ({ ...initialState }),
    artworkSessionExpired: () => ({ ...initialState, error: 'Сессия завершилась. Войдите снова.' }),
    clearArtworkAuthError(state) { state.error = null; },
  },
});

export const { artworkAuthStarted, artworkAuthSucceeded, artworkAuthFailed,
  artworkSignedOut, artworkSessionExpired, clearArtworkAuthError } = artworkAuthSlice.actions;
export default artworkAuthSlice.reducer;
