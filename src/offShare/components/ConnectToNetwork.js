import React, { useState } from 'react';
import { View, Text, Dimensions, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Button from 'apsl-react-native-button';
import style from '../model/style';
import { WifiWizard } from 'react-native-wifi-and-hotspot-wizard';
import Toast from 'react-native-simple-toast';
import FilePickerManager from 'react-native-file-picker';
import RNFetchBlob from 'rn-fetch-blob';
import SocketConnection from './FileTransfer';
var net = require('net');

const ConnectToNetwork = (props) => {
  let win = Dimensions.get('window');
  let WifiSSID, WifiPassword, WifiPasscode, serverPort = 7251;
  let showConnectToNetworkModal = props.showConnectToNetworkModal;
  let [StartSendingFile, showStartSendingFileState] = useState(false);
  let [connected, setConnected] = useState(false);
  // let [sendFile, showSendFile] = useState(false);
  return (
    <View
      style={{ height: 2 * win.height / 3, backgroundColor: '#fff', padding: 15 }}>
      {connected ? (
        <>
          <Text style={style.text}>Authenticate </Text>
          <Text></Text>
          <Text style={style.text}>Passcode</Text>
          <TextInput
            secureTextEntry={true}
            onChangeText={(text) => {
              WifiPasscode = text;
            }}
            style={{ borderBottomColor: '#212121', borderBottomWidth: 2 }}
            placeholder="Passcode"></TextInput>
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
              <Text style={style.headerText}> Authenticate </Text>
            </View>
          </Button>
        </>
      ) : (
          <>
            <Text style={style.text}>Connect To Network </Text>
            <Text></Text>
            <Text style={style.text}>ID</Text>
            <TextInput
              style={{ borderBottomColor: '#212121', borderBottomWidth: 2 }}
              placeholder="ID"
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
      <Modal
        isVisible={StartSendingFile}
        style={{
          justifyContent: 'flex-end',
          margin: 0,
        }}>
        <View
          style={{
            height: win.height / 2,
            backgroundColor: '#fff',
            padding: 15,
          }}>
          <SocketConnection/>
          {/* <Button
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
              showStartSendingFileState(false);
            }}>
            <View>
              <Text style={style.headerText}> Close </Text>
            </View>
          </Button> */}
        </View>
      </Modal>
    </View>
  );

  function connectToNetwork() {
    // setConnected(true);
    // Search For Nearby Devices
    console.log('Scanning Nearby Devices');
    WifiWizard.getNearbyNetworks().then((networks) => {
      console.log(networks);
      let WifiID = 'AndroidShare_';
      WifiID += WifiSSID;
      WifiSSID = WifiID;
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

  async function verifyPasscode() {
    // let code = '';
    // let j = 4;
    // for (var i = 0; i < 4; i++) {
    //   for (j; j < ((WifiPasscode[i] - 0) + j); j++) {
    //     code += WifiPasscode[j];
    //   }
    // }
    console.log(WifiPasscode);
    const code = await decrypt(WifiPasscode);
    // Search For Nearby Devices
    console.log('Connecting to Server');
    connectToServer(code);
  }

  async function decrypt(str) {
    console.log('received to decrypt:' + str);
    let code = '';
    let j = 4;
    var first = parseInt(str[0]);
    var second = parseInt(str[1]);
    var third = parseInt(str[2]);
    var fourth = parseInt(str[3]);
    console.log(first, second, third, fourth);
    for (var i = j; i < j + first; i++) {
      code += str[i];
    }
    code += '.';
    j += first;
    for (var i = j; i < j + second; i++) {
      code += str[i];
    }
    code += '.';
    j += second;
    for (var i = j; i < j + third; i++) {
      code += str[i];
    }
    code += '.';
    j += third;
    for (var i = j; i < j + fourth; i++) {
      code += str[i];
    }
    console.log(code);
    return code;
  }

  function connectToServer(code) {
    let client = net.createConnection(serverPort, code, () => {
      console.log('opened client on ' + JSON.stringify(client.address()));
      client.write('Verified\r\n');
    });

    client.on('data', (data) => {
      console.log('Client Received: ' + data);

      if (data === 'Verified') {
        Toast.show('Socket Created');
        showStartSendingFileState(true);
        // Send File
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
