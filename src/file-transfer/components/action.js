import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5%',
  },

  innerContainer: {
    backgroundColor: 'white',
    flex: 0.8,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  upperContainer: {
    backgroundColor: 'white',
    // flex: 0.2,
    justifyContent: 'center',
  },

  descContainer: {
    fontFamily: 'roboto',
    fontStyle: 'normal',
    fontSize: 24,
    alignItems: 'center',
    color: '#979797',
    marginTop: '10%',
  },

  lowerContainer: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    marginTop: '5%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  sendAndReceiveContainer: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: '10%',
    marginBottom: '10%',
    padding: '2%',
    alignItems: 'center',
  },

  imageContainer: {
    height: '40%',
  },

  buttonContainer: {
    height: '40%',
  },
});

export const ActionPage = (props) => {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <View style={styles.upperContainer}>
          <Text style={styles.descContainer}>What do you want to do?</Text>
          <View style={styles.lowerContainer}>
            <View style={styles.sendAndReceiveContainer}>
              <Image
                style={styles.imageContainer}
                source={require('../assets/send.png')}
              />
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => {
                  props.navigation.push('shareAddFilePage', {
                    navigation: props.navigation,
                  });
                }}>
                <Text
                  style={{
                    fontSize: 24,
                    fontFamily: 'roboto',
                    fontStyle: 'normal',
                    color: '#13C2C2',
                  }}>
                  SEND
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.sendAndReceiveContainer}>
              <Image
                style={styles.imageContainer}
                source={require('../assets/receive.png')}
              />
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => {}}>
                <Text
                  style={{
                    fontSize: 24,
                    fontFamily: 'roboto',
                    fontStyle: 'normal',
                    color: '#13C2C2',
                  }}>
                  RECEIVE
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ActionPage;
