import { Permissions } from 'expo-permissions';
import { CameraRoll } from 'react-native';
export default async () => {
  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  if (status !== 'granted') {
    alert('failed to get library asset, please enable and restart demo');
    return;
  }
  const { edges } = await CameraRoll.getPhotos({ first: 1 });
  const assets = edges.map(({ node: { image } }) => image.uri);
  if (assets.length === 0) {
    alert("Looks like you don't have any photos in your gallery :[");
  }
  return assets[0];
};
