import React from 'react';
import {View, Image} from 'react-native';
export class ShareMainHeader extends React.Component {
  render() {
    return (
      <View style={{backgroundColor: 'white', padding: '5%', paddingBottom: 0}}>
        <Image
          source={require('./assets/share_header.png')}
          style={{width: 120, height: 30, resizeMode: 'center'}}></Image>
      </View>
    );
  }
}
export default ShareMainHeader;
