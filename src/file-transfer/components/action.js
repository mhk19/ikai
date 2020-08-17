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
    //padding: '5%',
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
    justifyContent: 'center',
  },

  descContainer: {
    fontFamily: 'roboto',
    fontStyle: 'normal',
    fontSize: 24,
    alignItems: 'center',
    color: '#979797',
    marginTop: '20%',
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
    alignItems: 'center',
  },

  imageContainer: {
    resizeMode: 'contain',
    height: '50%',
  },

  buttonContainer: {
    height: '40%',
    alignItems: 'center',
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
              <TouchableOpacity
                onPress={() => {
                  props.navigation.push('shareAddFilePage', {});
                }}>
                <Image
                  style={styles.imageContainer}
                  source={require('../assets/send.png')}
                />
                <View style={styles.buttonContainer}>
                  <Text
                    style={{
                      fontSize: 24,
                      fontFamily: 'roboto',
                      fontStyle: 'normal',
                      color: '#13C2C2',
                      fontWeight: 'bold',
                    }}>
                    SEND
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.sendAndReceiveContainer}>
              <TouchableOpacity onPress={() => {}}>
                <Image
                  style={styles.imageContainer}
                  source={require('../assets/receive.png')}
                />
                <View style={styles.buttonContainer}>
                  <Text
                    style={{
                      fontSize: 24,
                      fontFamily: 'roboto',
                      fontStyle: 'normal',
                      color: '#13C2C2',
                      fontWeight: 'bold',
                    }}>
                    RECEIVE
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ActionPage;
