import React from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    height: 150,
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
            fontSize: 16,
          }}>
          {this.props.desc}
        </Text>
      </View>
    );
  }
}

export default WaitingPage;
