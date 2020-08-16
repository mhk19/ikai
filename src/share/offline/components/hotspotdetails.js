import React, {useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {makeServer, encryptIP} from '../utils/hotspot';
import Toast from 'react-native-simple-toast';
const styles = StyleSheet.create({
  outerContainer: {
    // maxWidth: '88%',
    // backgroundColor: 'red',
    // maxHeight: '70%',
    // marginLeft: '6%',
    // marginTop: '30%',
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  innerContainer: {
    height: '60%',
    width: '86%',
    marginLeft: '7%',
    backgroundColor: 'white',
    maxHeight: '70%',
  },
  upperContainer: {
    paddingTop: '15%',
    height: '40%',
    backgroundColor: 'white',
  },

  buttonContainer: {
    height: '40%',
    backgroundColor: 'white',
    flexDirection: 'row',
    fontStyle: 'normal',
    fontFamily: 'roboto',
    fontSize: 18,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  button: {
    width: '30%',
    height: '80%',
    backgroundColor: 'white',
  },
  cameraButton: {
    minHeight: '10%',
    backgroundColor: '#13C2C2',
    width: '100%',
    alignItems: 'center',
    borderRadius: 5,
  },
  importButton: {
    backgroundColor: 'white',
    minHeight: '10%',
    width: '100%',
    alignItems: 'center',
    borderColor: '#13C2C2',
    borderWidth: 2,
    borderRadius: 5,
  },
  image: {
    resizeMode: 'center',
    height: '100%',
    width: '100%',
  },
});

export const HotspotDetails = (props) => {
  const [passcode, setPasscode] = useState();
  async function readyHandler() {
    let server = await makeServer(8000);
    console.log('server started', server);
    setPasscode(encryptIP(server.ip));
  }
  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <View style={styles.upperContainer}>
          <Text
            style={{
              color: '#979797',
              fontSize: 25,
              fontFamily: 'roboto',
              margin: '5%',
              textAlign: 'center',
            }}>
            Open your hotspot and press on ready
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text>{passcode}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              readyHandler();
            }}>
            <Text>Ready</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HotspotDetails;
