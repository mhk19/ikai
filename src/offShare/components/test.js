import React, {useState, useEffect} from 'react';
import {ScrollView, View, Text, PermissionsAndroid} from 'react-native';
import Modal from 'react-native-modal';
import Button from 'apsl-react-native-button';
import style from '../model/style';
import {WifiWizard, HotspotWizard} from 'react-native-wifi-and-hotspot-wizard';
import Toast from 'react-native-simple-toast';
import NearbyDevices from '../utils/NearbyDevices';
import ConnectToNetwork from '../utils/ConnectToNetwork';
import {Dimensions} from 'react-native';
import TurnOnHotspot from '../utils/TurnOnHotspot';
import {NetworkInfo} from 'react-native-network-info';
import RctSockets from './tcp';
var net = require('net');

const Home = () => {
  const win = Dimensions.get('window');

  let [GetNearbyNetworksModalState, showGetNearbyNetworksModal] = useState(
    false,
  );
  let [ConnectToNetworkModalState, showConnectToNetworkModal] = useState(false);
  let [TurnOnHotspotModalState, showTurnOnHotspotModal] = useState(false);

  let HotspotSSID, HotspotPassword;
  return (
    <ScrollView scrollEnabled={true} style={{padding: 15}}>
      <Text style={style.text}>Send or Receive Files</Text>
      <Text />
      <Button
        style={{backgroundColor: '#00e676', borderWidth: 0, elevation: 5}}
        onPress={() => {
          sender();
        }}>
        <View>
          <Text style={style.buttonText}> SEND </Text>
        </View>
      </Button>
      <Button
        style={{backgroundColor: '#00e676', borderWidth: 0, elevation: 5}}
        onPress={() => {
          receiver();
        }}>
        <View>
          <Text style={style.buttonText}> RECEIVE </Text>
        </View>
      </Button>
      <Button
        style={{backgroundColor: '#e57373', borderWidth: 0, elevation: 5}}
        onPress={() => {
          turnOffWifi();
        }}>
        <View>
          <Text style={style.buttonText}> TURN OFF WIFI</Text>
        </View>
      </Button>
      <Button
        style={{backgroundColor: '#e57373', borderWidth: 0, elevation: 5}}
        onPress={() => {
          turnOffHotspot();
        }}>
        <View>
          <Text style={style.buttonText}> TURN OFF HOTSPOT</Text>
        </View>
      </Button>

      <Modal
        isVisible={GetNearbyNetworksModalState}
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
          <NearbyDevices />

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
              getNearbyNetworks();
            }}>
            <View>
              <Text style={style.headerText}> Close </Text>
            </View>
          </Button>
        </View>
      </Modal>
      <Modal
        isVisible={TurnOnHotspotModalState}
        style={{
          justifyContent: 'flex-end',
          margin: 0,
        }}>
        <TurnOnHotspot showTurnOnHotspotModal={showTurnOnHotspotModal} />
      </Modal>
      <Modal
        isVisible={ConnectToNetworkModalState}
        style={{
          justifyContent: 'flex-end',
          margin: 0,
        }}>
        <ConnectToNetwork
          showConnectToNetworkModal={showConnectToNetworkModal}
        />
      </Modal>
    </ScrollView>
  );

  async function sender() {
    // TODO: permissions
    // await turnOnWifi();
    // console.log("wifi turned on");
    // await isWifiEnabled();
    // console.log("wifi is enabled");
    // await connectToNetwork();
    // console.log("connected to network.")
    // Network info
    let x;
    NetworkInfo.getIPAddress().then((ipAddress) => {
      console.log(ipAddress);
      x = ipAddress;
    });
    NetworkInfo.getIPV4Address().then((ipv4Address) => {
      console.log(ipv4Address);
    });
    let client = net.createConnection(6666, x, () => {
      client.write('Hello, server! Love, Client.');
    });
    client.on('data', (data) => {
      console.log('Client Received: ' + data);
    });
  }

  async function receiver() {
    await turnOnHotspot();
    // var server = net.createServer(function(socket) {
    //   socket.write('excellent!');
    // }).listen(12345);
  }

  async function turnOnWifi() {
    WifiWizard.turnOnWifi().then(() => {
      Toast.show('WiFi is now ACTIVE');
    });
  }

  function turnOffWifi() {
    WifiWizard.turnOffWifi().then(() => {
      Toast.show('WiFi is now INACTIVE');
    });
  }

  async function isWifiEnabled() {
    WifiWizard.isWifiEnabled().then((status) => {
      if (status) {
        Toast.show('WiFi is ENABLED');
      } else {
        Toast.show('WiFi is DISABLED');
      }
    });
  }

  function getNearbyNetworks() {
    showGetNearbyNetworksModal(true);
  }

  async function connectToNetwork() {
    showConnectToNetworkModal(true);
  }

  function disconnectFromNetwork() {
    WifiWizard.disconnectFromNetwork()
      .then(() => {
        Toast.show('Disconnected From Current Network.');
      })
      .catch((err) => {
        Toast.show('Failed To Disconnect.');
      });
  }

  function isReadyForCommunication() {
    WifiWizard.isReadyForCommunication().then((status) => {
      if (status) {
        Toast.show('WiFi is Ready For Communication');
      } else {
        Toast.show('WiFi is Not Ready For Communication');
      }
    });
  }

  async function turnOnHotspot() {
    showTurnOnHotspotModal(true);
  }

  function turnOffHotspot() {
    HotspotWizard.turnOffHotspot()
      .then((data) => {
        if (data.status == 'failed') {
          Toast.show(
            'Failed to turn off hotspot. Note That, this can only turn off hotspot which is started using this library.',
            Toast.LONG,
          );
          return false;
        }
        if (data.status == 'success') {
          Toast.show('Turned Off Hotspot.');
          return true;
        }
      })
      .catch((err) => {
        Toast.show('Something went wrong..');
        return false;
      });
  }

  function isHotspotEnabled() {
    HotspotWizard.isHotspotEnabled().then((status) => {
      if (status) {
        Toast.show('Hotspot Is Enabled');
      } else {
        Toast.show('Hotspot Is Disabled');
      }
    });
  }
};

export default Home;
