import React, {useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {makeServer, encryptIP} from '../utils/hotspot';
import Toast from 'react-native-simple-toast';
import {ReceiveFileOffline} from './receiveFile';

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
    marginTop: '30%',
    height: '40%',
    resizeMode: 'contain',
  },
  descContainer: {
    marginTop: '5%',
    fontFamily: 'roboto',
    fontStyle: 'normal',
    fontSize: 20,
    textAlign: 'center',
    color: '#979797',
  },
  buttonContainer: {
    height: '45%',
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
    height: '18%',
    borderRadius: 30,
    backgroundColor: 'white',
    borderColor: '#13C2C2',
    borderWidth: 2,
  },
  buttonPair: {
    width: '60%',
    height: '18%',
    borderRadius: 30,
    backgroundColor: '#13C2C2',
    margin: '5%',
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

export const HotspotDetails = (props) => {
  const [passcode, setPasscode] = useState();
  const [isReceiving, setIsReceiving] = useState(false);
  const [sent, setSent] = useState(false);
  const [fileName, setFileName] = useState(false);
  async function readyHandler() {
    let server = await makeServer(8000, setIsReceiving, setFileName, setSent);
    console.log('server started', server);
    setPasscode(encryptIP(server.ip));
  }
  if (isReceiving) {
    return (
      <ReceiveFileOffline sent={sent} fileName={fileName}></ReceiveFileOffline>
    );
  }
  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <Image
          source={require('../assets/network.png')}
          style={styles.shareImageContainer}
        />
        <Text style={styles.descContainer}>
          Connect your hotspot and Press on ready
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonDetail} onPress={() => {}}>
          <Text style={styles.textInfo2}>{passcode}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonPair}
          onPress={() => {
            readyHandler();
          }}>
          <Text style={styles.textInfo}>Ready</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HotspotDetails;
