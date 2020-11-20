import React from 'react';
import {View, Text, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';
class MenuButton extends React.Component {
  render() {
    return (
      <TouchableOpacity
        onPress={
          this.props.navigation
            ? () => this.props.navigation.push(this.props.page)
            : () => {
                this.props.press();
              }
        }
        disabled={this.props.disable}
        style={{
          minWidth: '90%',
          backgroundColor: '#13C2C2',
          height: 60,
          flexDirection: 'row',
          marginBottom: '10%',
          borderBottomWidth: 2,
          borderColor: 'white',
          borderRadius: 10,
        }}>
        <Image
          source={this.props.source}
          style={{
            height: 30,
            width: 30,
            alignSelf: 'center',
            marginLeft: '5%',
            marginRight: '10%',
          }}></Image>
        <Text style={{alignSelf: 'center', color: 'white', fontSize: 20}}>
          {this.props.text}
        </Text>
      </TouchableOpacity>
    );
  }
}
export class MenuMainPage extends React.Component {
  render() {
    console.log(this.props.navigation);
    return (
      <View
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: '#13C2C2',
          flexDirection: 'column',
          alignItems: 'center',
          borderRightColor: '#595959',
          borderRightWidth: 3,
        }}>
        <View
          style={{
            height: '15%',
            width: '100%',
            backgroundColor: '#13C2C2',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={require('../../../assets/images/menu/ikai.png')}
            style={{
              width: '50%',
              height: '90%',
              resizeMode: 'center',
              marginTop: '10%',
              alignSelf: 'center',
            }}></Image>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: '15%',
            minWidth: '90%',
          }}>
          <Image
            source={require('../../../assets/images/chat/contact_avatar.png')}
            style={{
              height: 60,
              width: 60,
              resizeMode: 'center',
              marginLeft: 0,
              marginRight: '5%',
            }}></Image>
          <Text
            style={{
              color: 'white',
              fontSize: 23,
              fontWeight: 'medium',
              minWidth: '60%',
            }}>
            {this.props.route.params.name}
          </Text>
        </View>
        <View
          style={{
            marginTop: '15%',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <MenuButton
            source={require('../../../assets/images/menu/find.png')}
            text={'Find Friends'}
            page={'Find Friends'}
            navigation={this.props.navigation}
          />
          <MenuButton
            source={require('../../../assets/images/menu/request.png')}
            text={'Your Requests'}
            page={'Your Requests'}
            navigation={this.props.navigation}
          />
          <MenuButton
            source={require('../../../assets/images/menu/settings.png')}
            text={'Settings'}
            disable={true}
          />
          <MenuButton
            source={require('../../../assets/images/menu/logout.png')}
            text={'Log out'}
            press={() => {
              Toast.show('Logging You out');
              sleep(1000).then(() => {
                this.props.route.params.logoutHandler();
              });
            }}
          />
        </View>
      </View>
    );
  }
}
export default MenuMainPage;
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
