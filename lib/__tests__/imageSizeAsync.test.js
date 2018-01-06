import { Image } from 'react-native';
import React from 'react';
import imageSizeAsync from '../imageSizeAsync';

it("get's image size", async () => {
  const uri =
    'https://upload.wikimedia.org/wikipedia/en/1/17/Batman-BenAffleck.jpg';
  const size = await imageSizeAsync({ url: uri });
  expect(size).toBe(true);
});
