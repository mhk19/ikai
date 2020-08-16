import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Button from 'apsl-react-native-button';
import style from '../model/style';
import {HotspotWizard} from 'react-native-wifi-and-hotspot-wizard';
import Toast from 'react-native-simple-toast';
import RNFetchBlob from 'rn-fetch-blob';
import {NetworkInfo} from 'react-native-network-info';
var net = require('net');
var receivedBuffers = [];

let TurnOnHotspot = (props) => {
  let win = Dimensions.get('window');
  let [HotspotSSID, setHotspotSSID] = useState();
  let [HotspotPassword, setHotspotPassword] = useState();
  let showTurnOnHotspotModal = props.showTurnOnHotspotModal;
  let [connected, setHotspotConnected] = useState(false);
  return (
    <View
      style={{height: win.height / 2, backgroundColor: '#fff', padding: 10}}>
      {connected ? (
        <View style={{alignSelf: 'center', marginTop: 20}}>
          <Icon
            name="check-circle"
            color="green"
            size={150}
            style={{alignSelf: 'center'}}></Icon>
          <Text style={{fontSize: 35, alignSelf: 'center'}}>
            Hotspot Active{' '}
          </Text>
          {connected == 'success' ? (
            <Text>Here are your credentials</Text>
          ) : (
            <Text>
              Failed to set custom credentials. Here is the randomly generated
              credentials.
            </Text>
          )}
          <Text style={{fontSize: 20, textAlign: 'left', fontWeight: 'bold'}}>
            SSID : {HotspotSSID}{' '}
          </Text>
          <Text style={{fontSize: 20, textAlign: 'left', fontWeight: 'bold'}}>
            Password : {HotspotPassword}{' '}
          </Text>
        </View>
      ) : (
        <>
          <Text style={style.text}>Setup Hotspot </Text>
          <Text></Text>
          <Text style={style.text}>Hotspot SSID</Text>
          <TextInput
            style={{borderBottomColor: '#212121', borderBottomWidth: 2}}
            placeholder="SSID"
            onChangeText={(text) => {
              setHotspotSSID(text);
            }}></TextInput>
          <Text></Text>
          <Text style={style.text}>Hotspot Password</Text>
          <TextInput
            secureTextEntry={true}
            onChangeText={(text) => {
              setHotspotPassword(text);
            }}
            style={{borderBottomColor: '#212121', borderBottomWidth: 2}}
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
              Toast.show('Starting Hotspot... Please Wait');
              connectToHotspot();
            }}>
            <View>
              <Text style={style.headerText}> Start Hotspot </Text>
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
          showTurnOnHotspotModal(false);
        }}>
        <View>
          <Text style={style.headerText}> Close </Text>
        </View>
      </Button>
    </View>
  );

  function connectToHotspot() {
    HotspotWizard.turnOnHotspot(HotspotSSID, HotspotPassword).then((data) => {
      console.log(data);
      if (data.status == 'success' || data.status == 'auth') {
        setHotspotConnected(data.status);
        if (data.status == 'auth') {
          setHotspotPassword(data.password);
          setHotspotSSID(data.SSID);
        }
      } else {
        Toast.show('Something went wrong');
      }
    });
    makeServer();
  }
};
async function makeServer() {
  console.log('i m here');
  await NetworkInfo.getIPV4Address().then((ipv4Address) => {
    x = ipv4Address;
    console.log('ipv4');
    console.log(ipv4Address);
    console.log('ipv4');
  });
  await NetworkInfo.getIPAddress().then((ipAddress) => {
    y = ipAddress;
    console.log('ipAddress');
    console.log(ipAddress);
    console.log('ipAddress');
  });
  console.log('making server now');
  let server = net
    .createServer((socket) => {
      console.log('socket created');
      socket.on('data', (data) => {
        console.log('data received: ' + data);
        socket.write('Echo server\r\n');
      });

      socket.on('error', (error) => {
        console.log('Error: ' + error);
      });

      socket.on('close', (error) => {
        console.log('socket is closed.');
      });
    })
    .listen(8001, () => {
      console.log('listening to port 6666.');
    });

  server.on('error', (error) => {
    console.log('error: ' + error);
  });

  server.on('close', () => {
    console.log('server is closed.');
  });
}
// function makeServer() {
//   console.log('making server.');
//   let server = net
//     .createServer((socket) => {
//       console.log('socket created');
//       socket.on('data', (data) => {
//         if (data === 'EOF') {
//           RNFetchBlob.fs
//             .writeStream(
//               RNFetchBlob.fs.dirs.DownloadDir + '/test2.pdf',
//               'base64',
//             )
//             .then((stream) => {
//               for (let i = 0; i < receivedBuffers.length; i++) {
//                 stream.write(receivedBuffers[i]);
//               }
//               console.log(receivedBuffers);
//               console.log('File completely received');
//               receivedBuffers = [];
//               return stream.close();
//             });
//         } else if (data !== 'EOF' && data != 'SOF') {
//           receivedBuffers.push(data);
//         }
//       });

//       socket.on('error', (error) => {
//         console.log('Error: ' + error);
//       });

//       socket.on('close', (error) => {
//         console.log('socket is closed.');
//       });
//     })
//     .listen(6667, () => {
//       console.log('listening to port 6666.');
//     });

//   server.on('error', (error) => {
//     console.log('error: ' + error);
//   });

//   server.on('close', () => {
//     console.log('server is closed.');
//   });
// }
export default TurnOnHotspot;
