import {View, Text, Button} from 'react-native';
import ScanbotSDK from 'react-native-scanbot-sdk';
import React from 'react';
import {Colors} from './android/app/model/Colors';
import initScanBotSdk from './src/camscanner/init';
import {ScannerMainPage} from './src/camscanner/components/mainpage';

export class App extends React.Component {
  constructor(props) {
    super(props);
    initScanBotSdk().then((r) => console.log(r));
  }
  render() {
    return (
      <View>
        <ScannerMainPage />
      </View>
    );
  }
}

export default App;
