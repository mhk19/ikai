import ImagePicker from 'react-native-image-picker';

export class ImageUtils {
  static async pickFromGallery() {
    const options = {
      title: 'Import image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    return await new Promise((resolve) => {
      ImagePicker.launchImageLibrary(options, async (response) => {
        resolve(response);
      });
    });
  }
}
