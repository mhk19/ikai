import React from 'react';
import {View, Image} from 'react-native';
import {TouchableOpacity} from 'react-native';
export class MainHeader extends React.Component {
  render() {
    if (this.props.view) {
      return (
        <View
          style={{
            backgroundColor: 'white',
            paddingTop: '5%',
            paddingLeft: '5%',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <TouchableOpacity onPress={this.props.open}>
            <Image
              source={require('../../../assets/images/ikai/menu.png')}
              style={{
                width: 30,
                height: 30,
                resizeMode: 'center',
              }}></Image>
          </TouchableOpacity>
          <Image
            source={this.props.source}
            style={{
              width: 120,
              height: 30,
              resizeMode: 'center',
              alignSelf: 'flex-end',
            }}></Image>
        </View>
      );
    } else {
      return <View></View>;
    }
  }
}
export default MainHeader;
