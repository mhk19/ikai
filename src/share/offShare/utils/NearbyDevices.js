import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import style from '../model/style';
import {WifiWizard} from 'react-native-wifi-and-hotspot-wizard';
import {FlatList, TextInput} from 'react-native-gesture-handler';

let NearbyDevices = () => {
  let [passcode, setPasscode] = useState('');
  return (
    <View>
      <Text>
        Connect to the other's device hostpot with your wifi, then enter the
        passcode for extra security features.
      </Text>
      <TextInput
        style={{width: 100, height: 30, backgroundColor: 'red'}}></TextInput>
    </View>
  );
};

export default NearbyDevices;
