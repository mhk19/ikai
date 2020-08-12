import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  header: {
    width: '100%',
    height: 70,
    backgroundColor: '#13C2C2',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    minHeight: '95%',
    maxHeight: '95%',
    width: '84%',
    marginLeft: '8%',
    marginTop: '8%',
    backgroundColor: 'white',
    flexDirection: 'column',
  },
});
export class ShareOnlineChatWindow extends React.Component {
  render() {
    let data = this.props.route.params;
    return (
      <View style={styles.outerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={{margin: '5%'}}
            onPress={() => {
              this.props.navigation.pop();
            }}>
            <Image
              source={require('../assets/back.png')}
              style={{height: 30, width: 30}}></Image>
          </TouchableOpacity>
          <Image
            source={require('../assets/contact_avatar.png')}
            style={{width: 40, height: 40, marginRight: '10%'}}></Image>
          <Text style={{color: 'white', fontSize: 25}}>{data.chatname}</Text>
        </View>
      </View>
    );
  }
}

export default ShareOnlineChatWindow;
