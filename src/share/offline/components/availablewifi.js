import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {decrypt} from '../utils/wifi';
import Toast from 'react-native-simple-toast';
import {TextInput} from 'react-native-gesture-handler';
var net = require('net');
const styles = StyleSheet.create({
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
        props.navigation.push('sendpage', {port: 8000, ip: ip, client: client});
      }
    });
  };
  //   setNearbyNetworks(getNearbyWifi());
  return (
    <View>
      <Text>
        Connect to your friends hotspot, then enter the passcode displayed on
        his phone and press ok.
      </Text>
      <TextInput
        style={{height: 40, width: 300, backgroundColor: 'red'}}
        onChange={(e) => {
          setPasscode(e.nativeEvent.text);
        }}></TextInput>
      <TouchableOpacity
        style={{
          height: 50,
          width: 50,
          backgroundColor: 'yellow',
        }}
        onPress={verifySender}></TouchableOpacity>
    </View>
  );
};

export default AvailableWifi;
