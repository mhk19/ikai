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

export class ErrorPage extends React.Component {
  render() {
    return (
      <View style={styles.innerContainer}>
        <Image
          style={styles.imageContainer}
          source={require('../assets/networkfail.png')}
        />
        <Text
          style={{
            color: '#FF0000',
            fontFamily: 'roboto',
            fontStyle: 'normal',
            fontSize: 16,
            textAlign: 'center',
          }}>
          Failed. Please check your internet connection and try again.
        </Text>
      </View>
    );
  }
}

export default ErrorPage;
