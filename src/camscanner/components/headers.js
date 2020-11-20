import React from 'react';
import {View, Image} from 'react-native';
export class ScannerMainHeader extends React.Component {
  render() {
    return (
      <View
        style={{
          backgroundColor: 'white',
          padding: '5%',
          paddingRight: 0,
          paddingBottom: 0,
        }}>
        <Image
          source={require('../../../assets/images/camscanner/scanner_header.png')}
          style={{
            width: 120,
            height: 30,
            resizeMode: 'center',
            alignSelf: 'flex-end',
          }}></Image>
      </View>
    );
  }
}
