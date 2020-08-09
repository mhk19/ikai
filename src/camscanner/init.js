import {DocumentDirectoryPath, ExternalDirectoryPath} from 'react-native-fs';
import ScanbotSDK from 'react-native-scanbot-sdk';
const licenseKey =
  'GkmiDxmiPjzvYafbcn+AAP2h2rPRhM' +
  '0nqYjVrlW3FVoLhaa4+R4WrwqQltvz' +
  'Oux49e0wyIAW+HTU1lQ+gxS5uK9ZbB' +
  'CwwxIhqx1LL3fdoJxRSVR/4tvzIgkF' +
  'brOc8vZmXz4UzaOwuzykhWw5SS1w/b' +
  'xg31CcBMDIFXpfaMum34q+zNR/8aRi' +
  'YJ4La+hxgtFv3G8mWVZ97QWKHr/tea' +
  'pOR474KB7bFghGKsbbsPwmj7x9yCSA' +
  'hDSBavGeSAVHj+XnRFPMM106cEV9ZF' +
  'qApx853w59uHsLVn3t1evPZ2QMGgBV' +
  '55f1H9yeo+/VvTyrwppev5F1ij8axZ' +
  'klaqv9m+tFMQ==\nU2NhbmJvdFNESw' +
  'pjb20ubGVhcm5uYXRpdmUKMTU5OTYw' +
  'OTU5OQoxMDcxMDIKMw==\n';

async function initScanBotSdk() {
  const options = {
    licenseKey: licenseKey,
    loggingEnabled: true,
    storageImageFormat: 'JPG', // Optional image format - JPG or PNG. Default is JPG.
    storageImageQuality: 80, // Optional image JPG quality. Default is 80.
    storageBaseDirectory: ExternalDirectoryPath + '/my-custom-storage', // Optional custom storage path.
    // The new and improved ML-based document detection is available from
    // ScanbotSDK react-native 4.1.0 and requires iOS 11.2:
    documentDetectorMode: 'ML_BASED',
  };
  let x = await ScanbotSDK.initializeSDK(options);
  info = await ScanbotSDK.getLicenseInfo();
  console.log(info);
  // TODO(burnerlee): Show a warning of invalid/expired license key in the App.
  return x;
}

export default initScanBotSdk;
