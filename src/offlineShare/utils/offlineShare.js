import Hotspot from 'react-native-wifi-hotspot';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  ToastAndroid,
  ListView
} from 'react-native';

async function offlinestartServer() {
  Hotspot.enable(() => {
    ToastAndroid.show("Hotspot Enabled",ToastAndroid.SHORT);
  }, (err) => {
    ToastAndroid.show(err.toString(),ToastAndroid.SHORT);
  })

  Hotspot.peersList((data) => {
    const peers = JSON.parse(data);
    this.setState({peers, dataSource: this.ds.cloneWithRows(peers)})
  }, (err) => {
    ToastAndroid.show(err.toString(), ToastAndroid.SHORT);
  })
}

export default offlinestartServer;

async function offlinestartReceiver() {
  Hotspot.disable(() => {
    ToastAndroid.show("Hotspot Disabled",ToastAndroid.SHORT);
  }, (err) => {
    ToastAndroid.show(err.toString(),ToastAndroid.SHORT);
  })
}

export default offlinestartReceiver;
