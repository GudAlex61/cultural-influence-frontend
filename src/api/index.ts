import { Api } from './generated/ArtworkExcerptsApi';

export const artworkApi = new Api({ baseURL: '', withCredentials: true, timeout: 10000 });
