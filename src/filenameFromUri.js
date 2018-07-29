// @flow
function filenameFromUri(url: string): string {
  return url
    .substring(url.lastIndexOf('/') + 1)
    .split('?')[0]
    .split('#')[0];
}

export default filenameFromUri;
