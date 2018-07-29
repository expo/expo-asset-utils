// @flow
import filenameFromUri from './filenameFromUri';

function replaceNameInUri(url: string, filename: string): string {
  const originalName = filenameFromUri(url);
  return url.replace(originalName, filename);
}
export default replaceNameInUri;
