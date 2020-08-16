import React, { useState, useEffect, useRef } from 'react';
import DocumentPicker from 'react-native-document-picker';
import FilePickerManager from 'react-native-file-picker';
import { View, StyleSheet, Button, Text } from 'react-native';
import { DocumentDirectoryPath, writeFile, stat } from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import { TextInput } from 'react-native-gesture-handler';
import RNFS from 'react-native-fs';
import { WifiWizard } from 'react-native-wifi-and-hotspot-wizard';
var net = require('net');
const MAXIMUM_MESSAGE_SIZE = 65535;
const END_OF_FILE_MESSAGE = 'EOF';

const SocketConnection = (client) => {
  const [file, setFile] = useState(null);

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
            client.write(chunk);
          });
          ifstream.onError((err) => {
            console.log('error in reading file', err);
          });
          ifstream.onEnd(() => {
            client.write(END_OF_FILE_MESSAGE);
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
