import { configureStore } from '@reduxjs/toolkit';
import auth from './auth.slice';
import artworkExcerpts from './artwork-excerpts.slice';

export const createArtworkStore = () => configureStore({ reducer: { auth, artworkExcerpts } });
export const artworkStore = createArtworkStore();
export type RootState = ReturnType<typeof artworkStore.getState>;
export type AppDispatch = typeof artworkStore.dispatch;
