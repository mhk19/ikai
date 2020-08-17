import React from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';
import {EatBeanLoader} from 'react-native-indicator';
const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  imageContainer: {
    height: '30%',
    resizeMode: 'contain',
    marginBottom: 20,
  },
});

export class WaitingPage extends React.Component {
  render() {
    return (
      <View style={styles.innerContainer}>
        <Image
          style={styles.imageContainer}
          source={require('../assets/network.png')}
        />
        <Text
          style={{
            color: '#979797',
            fontFamily: 'roboto',
            fontStyle: 'normal',
            fontSize: 20,
            marginBottom: '15%',
          }}>
          {this.props.desc}
        </Text>
        <EatBeanLoader color={'#13C2C2'} size={40}></EatBeanLoader>
      </View>
    );
  }
}

export default WaitingPage;
