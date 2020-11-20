import {DocumentDirectoryPath, ExternalDirectoryPath} from 'react-native-fs';
import ScanbotSDK from 'react-native-scanbot-sdk';
const licenseKey=
  "Gg9QeEyuQnaZnepKZKznE41hA5LWTt"+
  "oHqUdUYcKpnLXfjciosgfqZlTm6Yqi"+
  "Q/EbfgkoHwzXAA+ctx/jgNLedtwDB8"+
  "m1kw1gXheY3g93qMZUAQG/200lZ1Fz"+
  "NUwh4oRk5Kb1YxTEKGSC1WpNjrzMKW"+
  "7YKAJg4cR/OcBkPlVBDrPdsl477ifM"+
  "ubT0o2zjKYMgA8wrQdDlgnfu70xWZk"+
  "Zl4AP7bPmJLHHDcm7F/cq9BdnS2WK3"+
  "fuFeheLbKyKaGP17Q3lpfvI0N522Pn"+
  "pjU5bK/65kVlgOMJm16588TXCsSgGy"+
  "cI3Y9wuLpgUR+6B/cSJqbwgLKOemGw"+
  "V0heW+BMxlVA==\nU2NhbmJvdFNESw"+
  "pjb20uaWthaQoxNjA4MjQ5NTk5CjIw"+
  "OTcxNTEKMw==\n";

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
