import React from 'react';
import Hotspot from 'react-native-wifi-hotspot';
import wifi from 'react-native-android-wifi';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  ToastAndroid,
  ListView
} from 'react-native';

export class OfflineShareMainPage extends React.Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    const peers = []
    this.state = {
      peers,
      dataSource: this.ds.cloneWithRows(peers)
    }
  }
  render() {
    return (
      <View>
        <Button title="Send" onPress={this.offlinestartServer()}>
          Send
        </Button>
        <Button title="Receive" onPress={this.offlinestartReceiver()}>
          Receive
        </Button>
        <ListView dataSource = {this.state.dataSource} style = {{marginTop: 15}} renderRow = {(peer, index) => {
            return (
            <View style = {styles.viewList} key = {index}>
              <Text style = {styles.viewText}>
                {peer.device}
              </Text>
              <Text style = {styles.viewText}>
                {peer.ip}
              </Text>
              <Text style = {styles.viewText}>
                {peer.mac}
              </Text>
            </View>
            )}} enableEmptySections >
          
          </ListView>
      </View>
    );
  }

  offlinestartServer() {
    Hotspot.enable(() => {
      ToastAndroid.show("Hotspot Enabled",ToastAndroid.SHORT);
    }, (err) => {
      ToastAndroid.show(err.toString(),ToastAndroid.SHORT);
    })

    // To create a secure transfer medium
    // const hotspot = {SSID: 'ASSEM', password: ''}
    // Hotspot.create(hotspot, () => {
    //   ToastAndroid.show("Hotspot enstablished", ToastAndroid.SHORT);
    // }, (err) => {
    //   ToastAndroid.show(err.toString(), ToastAndroid.SHORT);
    // })

    // To Get SSID - needed to connect
    Hotspot.getConfig((config) => {
      ToastAndroid.show(config.ssid, ToastAndroid.SHORT);
    }, (err) => {
      ToastAndroid.show(err.toString(), ToastAndroid.SHORT);
    })
  
    // TO DO: make it clickable
    Hotspot.peersList((data) => {
      const peers = JSON.parse(data);
      this.setState({peers, dataSource: this.ds.cloneWithRows(peers)})
    }, (err) => {
      ToastAndroid.show(err.toString(), ToastAndroid.SHORT);
    })
  }

  offlinestartReceiver() {
    // disables hotspot
    Hotspot.disable(() => {
      ToastAndroid.show("Hotspot Disabled",ToastAndroid.SHORT);
    }, (err) => {
      ToastAndroid.show(err.toString(),ToastAndroid.SHORT);
    })
    // permission to use wifi
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Wifi networks',
          'message': 'We need your permission in order to find wifi networks'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Thank you for your permission! :)");
      } else {
        console.log("You will not able to retrieve wifi available networks list");
      }
    } catch (err) {
      console.warn(err)
    }
    // enables wifi
    wifi.setEnabled(true);
    // TO DO: if err -> fatal error
    wifi.isEnabled((isEnabled) => {
      if (isEnabled) {
        console.log("wifi service enabled");
      } else {
        console.log("wifi service is disabled");
      }
    });

    // Add listview to load wifi list
    /*
    wifiStringList is a stringified JSONArray with the following fields for each scanned wifi
    {
      "SSID": "The network name",
      "BSSID": "The address of the access point",
      "capabilities": "Describes the authentication, key management, and encryption schemes supported by the access point"
      "frequency":"The primary 20 MHz frequency (in MHz) of the channel over which the client is communicating with the access point",
      "level":"The detected signal level in dBm, also known as the RSSI. (Remember its a negative value)",
      "timestamp":"Timestamp in microseconds (since boot) when this result was last seen"
    }
    */
    wifi.loadWifiList((wifiStringList) => {
      var wifiArray = JSON.parse(wifiStringList);
        console.log(wifiArray);
      },
      (error) => {
        console.log(error);
      }
    );

    //Set true/false to enable/disable forceWifiUsage.
    //Is important to enable only when communicating with the device via wifi
    //and remember to disable it when disconnecting from device.
    wifi.forceWifiUsage(true);

    // TO DO: make wifilist clickable. Clicking on a button sends the ssid and then asks for password
    //found returns true if ssid is in the range
    const password = '';
    wifi.findAndConnect(ssid, password, (found) => {
      if (found) {
        console.log("wifi is in range");
      } else {
        console.log("wifi is not in range");
      }
    });

    wifi.connectionStatus((isConnected) => {
      if (isConnected) {
          console.log("is connected");
        } else {
          console.log("is not connected");
      }
    });

    //level is the detected signal level in dBm, also known as the RSSI. 
    // (Remember its a negative value)
    wifi.getCurrentSignalStrength((level) => {
      console.log(level);
    });

    // turns list Hard refresh the Android wifi scan, implemented using BroadcastReceiver to 
    // ensure that it automatically detects new wifi connections available. 
    // Could be done every 0.5 sec
    wifi.reScanAndLoadWifiList((wifiStringList) => {
      var wifiArray = JSON.parse(wifiStringList);
      console.log('Detected wifi networks - ',wifiArray);
    },(error)=>{
      console.log(error);
    });

    // disables wifi
    wifi.setEnabled(false);
  }
}
export default OfflineShareMainPage;
