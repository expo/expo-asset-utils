import filenameFromUri from './filenameFromUri';

function replaceFilenameFromUri(url: string, filename: string): string {
  const originalName = filenameFromUri(url);
  return url.replace(originalName, filename);
}
export default replaceFilenameFromUri;
