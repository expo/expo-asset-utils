// @flow

import type { WildCard } from './resolveAsync';
import resolveAsync from './resolveAsync';

async function uriAsync(fileReference: WildCard): Promise<?string> {
  const asset = await resolveAsync(fileReference);
  if (!asset) {
    console.error('uriAsync: failed to resolve asset', fileReference);
  }
  return asset.localUri;
}

export default uriAsync;
