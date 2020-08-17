import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { decrypt } from '../utils/wifi';
import Toast from 'react-native-simple-toast';
import { TextInput } from 'react-native-gesture-handler';
var net = require('net');
const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  innerContainer: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    height: '55%',
  },
  shareImageContainer: {
    marginTop: '25%',
    height: '50%',
    resizeMode: 'contain',
  },
  descContainer: {
    marginTop: '2%',
    fontFamily: 'roboto',
    fontStyle: 'normal',
    fontSize: 20,
    textAlign: 'center',
    color: '#979797',
  },
  buttonContainer: {
    height: '57%',
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'column',
    marginTop: 0,
    fontStyle: 'normal',
    fontFamily: 'roboto',
    fontSize: 18,
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#212121',
    flexDirection: 'row',
    elevation: 0.5,
    alignItems: 'flex-end',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  buttonDetail: {
    width: '60%',
    height: '13%',
    borderRadius: 30,
    backgroundColor: 'white',
    borderColor: '#13C2C2',
    borderWidth: 2,
  },
  buttonPair: {
    width: '60%',
    height: '13%',
    borderRadius: 30,
    backgroundColor: '#13C2C2',
    margin: '3%',
  },
  textInfo: {
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: 12,
    color: 'white',
    fontSize: 20,
    fontFamily: 'roboto',
  },
  textInfo2: {
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: 12,
    color: '#13C2C2',
    fontSize: 20,
    fontFamily: 'roboto',
  },
});
export const AvailableWifi = (props) => {
  //   const [nearbyNetworksList, setNearbyNetworks] = useState([]);
  const [passcode, setPasscode] = useState('');
  const verifySender = () => {
    let ip = decrypt(passcode);
    console.log('starting to connect to receiver');
    let client = net.createConnection(8000, ip, () => {
      client.write('CONNECTME');
    });
    client.on('data', (data) => {
      console.log('Client Received: ' + data);
      if (data == 'SERI') {
        props.navigation.push('sendpage', { port: 8000, ip: ip, client: client });
      }
    });
  };
  //   setNearbyNetworks(getNearbyWifi());
  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <Image
          source={require('../assets/network.png')}
          style={styles.shareImageContainer}
        />
        <Text style={styles.descContainer}>
          Connect to hotspot and enter the passocde
          </Text>
        </View >

        <View style={styles.buttonContainer}>
          <TextInput
            style={styles.buttonDetail}
            onChange={(e) => {
              setPasscode(e.nativeEvent.text);
            }}></TextInput>
          <TouchableOpacity
            style={styles.buttonPair}
            onPress={verifySender}>
            <Text style={styles.textInfo}> Pair </Text>
          </TouchableOpacity>
      </View>
    </View>
  );
};

export default AvailableWifi;
