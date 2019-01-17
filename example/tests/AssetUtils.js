'use strict';
import AssetUtils from 'expo-asset-utils';
import React from 'react';
import { Asset } from 'expo-asset';

import getGalleryImageAsync from '../getGalleryImageAsync';
import * as TestUtils from '../TestUtils';

export const name = 'AssetUtils';

export async function test(t) {
  const shouldSkipTestsRequiringPermissions = await TestUtils.shouldSkipTestsRequiringPermissionsAsync();
  const describeWithPermissions = shouldSkipTestsRequiringPermissions ? t.xdescribe : t.describe;

  describeWithPermissions(name, () => {
    t.describe('AssetUtils.arrayFromObject()', () => {
      t.it('returns array from deep object', async () => {
        const input = {
          a: '',
          b: {
            c: '',
            d: '',
          },
          e: '',
        };
        const arr = AssetUtils.arrayFromObject(input);

        t.expect(Array.isArray(arr)).toBe(true);
        t.expect(arr.length).toBe(4);
      });
    });

    t.describe('AssetUtils.uriAsync()', () => {
      t.it('returns local uri from static resource', async () => {
        const localUri = await AssetUtils.uriAsync(require('../icon.png'));
        t.expect(!!localUri).toBe(true);
        t.expect(typeof localUri).toBe('string');
      });
      t.it('returns local uri from remote uri with name', async () => {
        const localUri = await AssetUtils.uriAsync(
          'https://d1wp6m56sqw74a.cloudfront.net/~assets/c9aa1be8a6a6fe81e20c3ac4106a2ebc',
          { fileName: 'image.png' }
        );
        t.expect(!!localUri).toBe(true);
        t.expect(typeof localUri).toBe('string');
      });
    });

    t.describe('AssetUtils.resolveAsync()', () => {
      t.it('returns an Expo Asset from a static resource', async () => {
        const asset = await AssetUtils.resolveAsync(require('../icon.png'));
        t.expect(!!asset).toBe(true);
        t.expect(!!asset.localUri).toBe(true);
      });
      t.it('returns an Expo Asset from a remote resource', async () => {
        const asset = await AssetUtils.resolveAsync(
          'https://d1wp6m56sqw74a.cloudfront.net/~assets/c9aa1be8a6a6fe81e20c3ac4106a2ebc',
          { fileName: 'image.png' }
        );
        t.expect(!!asset).toBe(true);
        t.expect(!!asset.localUri).toBe(true);
      });
      t.it('returns an Expo Asset from a React Native Image object', async () => {
        const asset = await AssetUtils.resolveAsync(
          { uri: 'https://d1wp6m56sqw74a.cloudfront.net/~assets/c9aa1be8a6a6fe81e20c3ac4106a2ebc' },
          { fileName: 'image.png' }
        );
        t.expect(!!asset).toBe(true);
        t.expect(!!asset.localUri).toBe(true);
      });
      t.it('returns an Expo Asset from a Expo Asset', async () => {
        const asset = await AssetUtils.resolveAsync(Asset.fromModule(require('../icon.png')));
        t.expect(!!asset).toBe(true);
        t.expect(!!asset.localUri).toBe(true);
      });
      t.it('returns an Expo Asset from a gallery asset', async () => {
        const assetLibraryImage = await getGalleryImageAsync();
        const asset = await AssetUtils.resolveAsync(assetLibraryImage);
        t.expect(!!asset).toBe(true);
        t.expect(!!asset.localUri).toBe(true);
      });
    });

    t.describe('AssetUtils.isReactImageFormat()', () => {
      t.it('is valid RN image object', () => {
        const obj = { uri: '...' };
        const isValid = AssetUtils.isReactImageFormat(obj);
        t.expect(isValid).toBe(true);
      });

      t.it('is not valid RN image object', () => {
        const obj = { localUri: 3 };
        const isValid = AssetUtils.isReactImageFormat(obj);
        t.expect(isValid).toBe(false);
      });
    });

    t.describe('AssetUtils.imageSizeAsync()', () => {
      t.it('get width & height from local uri', async () => {
        const asset = Asset.fromModule(require('../icon.png'));
        await asset.downloadAsync();
        const { width, height } = await AssetUtils.ImageUtils.getSizeAsync(asset.localUri);
        t.expect(typeof width).toBe('number');
        t.expect(typeof height).toBe('number');
      });
    });

    t.describe('AssetUtils.imageSizeAsync()', () => {
      t.it('get width & height from local uri', async () => {
        const asset = Asset.fromModule(require('../icon.png'));
        await asset.downloadAsync();
        const { width, height } = await AssetUtils.ImageUtils.getSizeAsync(asset.localUri);
        t.expect(typeof width).toBe('number');
        t.expect(typeof height).toBe('number');
      });
    });

    /*
    TODO: 
    * copyAssetToSameDirectoryWithNewNameAsync
    * fromUriAsync
    * fileInfoAsync
    * base64forImageUriAsync
    * cacheAssetsAsync
    */
  });
}
