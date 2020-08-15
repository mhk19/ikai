import React, {useState, useEffect, useRef} from 'react';
import DocumentPicker from 'react-native-document-picker';
import FilePickerManager from 'react-native-file-picker';
import {View, StyleSheet, Button, Text} from 'react-native';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
} from 'react-native-webrtc';
import {DocumentDirectoryPath, writeFile, stat} from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import {TextInput} from 'react-native-gesture-handler';
import RNFS from 'react-native-fs';
const MAXIMUM_MESSAGE_SIZE = 65535;
const END_OF_FILE_MESSAGE = 'EOF';

const SocketConnection = ({connection, updateConnection, channel, updateChannel}) => {
  const [file, setFile] = useState(null);
  const [receiver, setReceiver] = useState('');
  let receivedBuffers = [];

  const sendFile = () => {
    if (file) {
      console.log('the selected file is:', file);

      ReadFile(file);
    }
  };

  const selectFile = async () => {
    FilePickerManager.showFilePicker(null, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled file picker');
      } else if (response.error) {
        console.log('FilePickerManager Error: ', response.error);
      } else {
        setFile(response);
      }
    });
  };

  const ReadFile = (file) => {
    const fileData = [];
    const realPath = file.path;
    if (realPath !== null) {
      console.log('Path is', realPath);
      RNFetchBlob.fs
        .readStream(realPath, 'base64', MAXIMUM_MESSAGE_SIZE)
        .then((ifstream) => {
          ifstream.open();
          ifstream.onData((chunk) => {
            console.log('reading file');
            console.log(chunk);
            //fileData.push(chunk);
            socket.write(chunk);
          });
          ifstream.onError((err) => {
            console.log('error in reading file', err);
          });
          ifstream.onEnd(() => {
            socket.write(END_OF_FILE_MESSAGE);
            console.log('read successful');
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="Select File"
        onPress={() => {
          selectFile();
        }}
      />
      <Button
        title="Send File"
        onPress={() => {
          sendFile(file);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SocketConnection;
