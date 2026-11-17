/** The API URL is kept in the DTO; the browser loads S3 through the second Vite proxy. */
export function artworkMediaUrl(value: string): string {
  if (value.startsWith('http://localhost:9000/') || value.startsWith('http://127.0.0.1:9000/')) {
    const url = new URL(value);
    return `/s3${url.pathname}${url.search}`;
  }
  return value;
}
