import axios from 'axios';
import { artworkAuthStarted, artworkAuthSucceeded, artworkAuthFailed, artworkSignedOut } from '../store/auth.slice';
import type { AppDispatch } from '../store';
import type { ArtworkUser } from '../store/auth.slice';
import { artworkRequestError } from './artwork-errors';

export const artworkAuthHttp = axios.create({ baseURL: '/api', withCredentials: true, timeout: 10000 });
export interface ArtworkCredentials { username: string; password: string }

// Authentication is plain Axios + manual dispatch, without generation or thunk (LR6).
export async function loginArtworkUser(input: ArtworkCredentials, dispatch: AppDispatch): Promise<boolean> {
  dispatch(artworkAuthStarted());
  try {
    const { data } = await artworkAuthHttp.post<ArtworkUser>('/sessions', input);
    dispatch(artworkAuthSucceeded(data));
    return true;
  } catch (error) {
    dispatch(artworkAuthFailed(artworkRequestError(error).status === 401
      ? 'Неверный логин или пароль.' : artworkRequestError(error).message));
    return false;
  }
}

export async function registerArtworkUser(
  input: ArtworkCredentials & { displayName: string }, dispatch: AppDispatch,
): Promise<boolean> {
  dispatch(artworkAuthStarted());
  try {
    await artworkAuthHttp.post('/users', input);
  } catch (error) {
    dispatch(artworkAuthFailed(artworkRequestError(error).status === 409
      ? 'Этот логин уже занят.' : artworkRequestError(error).message));
    return false;
  }
  return loginArtworkUser({ username: input.username, password: input.password }, dispatch);
}

export async function logoutArtworkUser(dispatch: AppDispatch): Promise<boolean> {
  dispatch(artworkAuthStarted());
  try {
    await artworkAuthHttp.post('/sessions/logout');
    dispatch(artworkSignedOut());
    return true;
  } catch (error) {
    if (artworkRequestError(error).status === 401) {
      dispatch(artworkSignedOut());
      return true;
    }
    dispatch(artworkAuthFailed(artworkRequestError(error).message));
    return false;
  }
}
