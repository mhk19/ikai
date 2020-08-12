import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Footer, FooterTab, Button, Icon, Thumbnail} from 'native-base';

const styles = StyleSheet.create({
  footertab: {
    fontFamily: 'roboto',
    fontStyle: 'normal',
    backgroundColor: '#FFFFFF',
    shadowRadius: 4,
    shadowOffset: {width: 0, height: -1},
    shadowColor: 'rgba(151, 151, 151, 0.15)',
  },
  button: {},
  thumbnail: {
    height: 20,
    width: 20,
  },
});

const images = {
  menu: require('../assets/menu.png'),
  share: require('../assets/share.png'),
  scan: require('../assets/scan.png'),
  chat: require('../assets/chat.png'),
  menu_active: require('../assets/menu_active.png'),
  share_active: require('../assets/share_active.png'),
  scan_active: require('../assets/scan_active.png'),
  chat_active: require('../assets/chat_active.png'),
};

export function IkaiFooter({state, descriptors, navigation}) {
  return (
    <Footer>
      <FooterTab style={styles.footertab}>
        {/* <View> */}
        {state.routeNames.map((route, index) => {
          return (
            <Button
              vertical
              onPress={() => {
                navigation.navigate(route);
              }}>
              <Thumbnail
                source={
                  index !== state.index
                    ? images[route]
                    : images[route + '_active']
                }
                style={styles.thumbnail}
              />
              <Text
                style={{
                  color: index === state.index ? '#13C2C2' : '#595959',
                }}>
                {route}
              </Text>
            </Button>
          );
        })}
      </FooterTab>
    </Footer>
  );
}

export default IkaiFooter;
