import axios from 'axios';

export interface ArtworkRequestError { status: number; message: string }

export function isArtworkServiceUnavailable(error: unknown): boolean {
  return axios.isAxiosError(error) && (
    (!error.response && error.code !== 'ERR_CANCELED') ||
    [502, 503, 504].includes(error.response?.status ?? 0)
  );
}

export function artworkRequestError(error: unknown): ArtworkRequestError {
  const status = axios.isAxiosError(error) ? error.response?.status ?? 0 : 0;
  const messages: Record<number, string> = {
    400: 'Проверьте введённые данные и выбранные файлы.',
    401: 'Сессия завершилась. Войдите снова.',
    404: 'Отрывок не найден или недоступен.',
    409: 'Такая запись уже существует.',
    413: 'Размер файла превышает допустимый.',
  };
  return { status, message: messages[status] ?? 'Сервис недоступен. Попробуйте ещё раз.' };
}
