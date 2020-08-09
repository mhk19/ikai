import ScanbotSDK from 'react-native-scanbot-sdk';
import {Colors} from '../model/Colors';
import {Pages} from '../model/Page';
async function startDocumentScanner() {
  const config = {
    // Customize colors, text resources, etc..
    polygonColor: '#00ffff',
    bottomBarBackgroundColor: Colors.SCANBOT_RED,
    topBarBackgroundColor: Colors.SCANBOT_RED,
    cameraBackgroundColor: Colors.SCANBOT_RED,
    orientationLockMode: 'PORTRAIT',
    pageCounterButtonTitle: '%d Page(s)',
    multiPageEnabled: true,
    ignoreBadAspectRatio: true,
    autoSnappingSensitivity: 0.85,
    // documentImageSizeLimit: { width: 2000, height: 3000 },
    // maxNumberOfPages: 3,
    // See further config properties ...
  };
  const result = await ScanbotSDK.UI.startDocumentScanner(config);
  if (result.status === 'OK') {
    Pages.addList(result.pages);
    this.pushPage(Navigation.IMAGE_RESULTS);
  } else {
    console.log('Scanner Returned With an error.');
    //TODO: Show warning here too.
  }
}

export default startDocumentScanner;
