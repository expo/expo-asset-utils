// @flow
import { ImageStore } from 'react-native';

async function base64ForSystemTagAsync(imageTag: string): Promise<string> {
  return new Promise((resolve, reject) => {
    ImageStore.getBase64ForTag(imageTag, resolve, reject);
  });
}

export default base64ForSystemTagAsync;
