import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Footer, FooterTab, Button, Icon, Thumbnail} from 'native-base';
import {Keyboard} from 'react-native';
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

export function IkaiFooter(props) {
  const [keyboardShow, setKeyboardShow] = useState(true);
  useEffect(() => {
    keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardShow(false);
    });
    keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardShow(true);
    });
  }, []);
  if (keyboardShow) {
    return (
      <Footer>
        <FooterTab style={styles.footertab}>
          {/* <View> */}
          {props.state.routeNames.map((route, index) => {
            return (
              <Button
                vertical
                onPress={() => {
                  props.navigation.navigate(route);
                }}>
                <Thumbnail
                  source={
                    index !== props.state.index
                      ? images[route]
                      : images[route + '_active']
                  }
                  style={styles.thumbnail}
                />
                <Text
                  style={{
                    color: index === props.state.index ? '#13C2C2' : '#595959',
                  }}>
                  {route}
                </Text>
              </Button>
            );
          })}
        </FooterTab>
      </Footer>
    );
  } else {
    return <View></View>;
  }
}

export default IkaiFooter;
