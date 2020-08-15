import React, { useState } from 'react';
import { View, Text, Dimensions, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Button from 'apsl-react-native-button';
import style from '../model/style';
import { WifiWizard } from 'react-native-wifi-and-hotspot-wizard';
import Toast from 'react-native-simple-toast';
import SocketConnect from './SocketConnection';

const ConnectToNetwork = (props) => {
  let win = Dimensions.get('window');
  let WifiSSID, WifiPassword;
  let showConnectToNetworkModal = props.showConnectToNetworkModal;
  let [connected, setConnected] = useState(false);
  return (
    <View
      style={{ height: win.height / 2, backgroundColor: '#fff', padding: 15 }}>
      {connected ? (
        <View
          style={{ alignContent: 'center', alignSelf: 'center', marginTop: 50 }}>
          <Icon name="check-circle" color="green" size={150}></Icon>
          <Text style={{ fontSize: 35 }}> Connected </Text>
          <Text style={style.text}>WifiPasscode</Text>
          <TextInput
            secureTextEntry={true}
            onChangeText={(text) => {
              WifiPasscode = text;
            }}
            style={{ borderBottomColor: '#212121', borderBottomWidth: 2 }}
            placeholder="WifiPasscode"></TextInput>
          <Button
            style={{
              backgroundColor: '#00e676',
              width: '100%',
              height: 50,
              left: 12,
              borderWidth: 0,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              bottom: 60,
            }}
            onPress={() => {
              Toast.show('Authenticating... Please Wait');
              verifyPasscode();
            }}>
            <View>
              <Text style={style.headerText}> Send </Text>
            </View>
          </Button>
        </View>
      ) : (
          <>
            <Text style={style.text}>Connect To Network </Text>
            <Text></Text>
            <Text style={style.text}>SSID</Text>
            <TextInput
              style={{ borderBottomColor: '#212121', borderBottomWidth: 2 }}
              placeholder="SSID"
              onChangeText={(text) => {
                WifiSSID = text;
              }}></TextInput>
            <Text></Text>
            <Text style={style.text}>Password</Text>
            <TextInput
              secureTextEntry={true}
              onChangeText={(text) => {
                WifiPassword = text;
              }}
              style={{ borderBottomColor: '#212121', borderBottomWidth: 2 }}
              placeholder="Password"></TextInput>
            <Button
              style={{
                backgroundColor: '#00e676',
                width: '100%',
                height: 50,
                left: 12,
                borderWidth: 0,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                bottom: 60,
              }}
              onPress={() => {
                Toast.show('Connecting... Please Wait');
                connectToNetwork();
              }}>
              <View>
                <Text style={style.headerText}> Connect </Text>
              </View>
            </Button>
          </>
        )}

      <Button
        style={{
          backgroundColor: '#212121',
          width: '100%',
          height: 50,
          left: 12,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: 0,
        }}
        onPress={() => {
          showConnectToNetworkModal(false);
        }}>
        <View>
          <Text style={style.headerText}> Close </Text>
        </View>
      </Button>
    </View>
  );

  function connectToNetwork() {
    // Search For Nearby Devices
    console.log('Scanning Nearby Devices');
    WifiWizard.getNearbyNetworks().then((networks) => {
      console.log(networks);
      console.log(WifiSSID);
      let network = networks.filter((network) => {
        return network.SSID == WifiSSID;
      });
      if (network.length < 1) {
        console.log('network not found');
        Toast.show('Network Not Found');
      } else {
        // Connect To Network
        WifiWizard.connectToNetwork(network[0], WifiSSID, WifiPassword).then(
          (data) => {
            if (data.status == 'connected') {
              setConnected(true);
            } else {
              Toast.show('Failed To Connect');
            }
          },
        );
      }
    });
  }

  function verifyPasscode() {
    // Search For Nearby Devices
    console.log('Connecting to Server');
    connectToServer(WifiPasscode);
  }

  function connectToServer(WifiPasscode) {
    let client = net.createConnection(serverPort, WifiPasscode, () => {
      console.log('opened client on ' + JSON.stringify(client.address()));
      client.write('Hello, server! Love, Client.');
    });

    client.on('data', (data) => {
      console.log('Client Received: ' + data);

      if (data === 'Verified') {
        Toast.show('Socket Created')
      }

      // this.client.destroy(); // kill client after server's response
      // this.server.close();
    });

    client.on('error', (error) => {
      console.log('client error ' + error);
    });

    client.on('close', () => {
      this.client.destroy(); // kill client after server's response
      this.server.close();
      console.log('client close');
    });
  }
};

export default ConnectToNetwork;
