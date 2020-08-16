import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import FilePickerManager from 'react-native-file-picker';
import RNFetchBlob from 'rn-fetch-blob';
import {Button} from 'native-base';
import {send} from 'process';
var net = require('net');

export const SendPage = (props) => {
  const [file, setFile] = useState(null);
  console.log(props);
  let data = props.route.params;
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
  const ReadFile = () => {
    const realPath = file.path;
    if (realPath !== null) {
      console.log('path is', realPath);
      RNFetchBlob.fs
        .readStream(realPath, 'base64', 4095)
        .then((ifstream) => {
          ifstream.open();
          ifstream.onData((chunk) => {
            console.log('reading file');
            //fileData.push(chunk);
            data.client.write(chunk);
          });
          ifstream.onError((err) => {
            console.log('error in reading file', err);
          });
          ifstream.onEnd(() => {
            data.client.write('EOF');
            console.log('read successful');
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const sendFile = () => {
    console.log('sending file');
    data.client.write('SOF');
    sleep(1000).then(() => {
      data.client.write(file.fileName);
      sleep(500).then(() => {
        ReadFile();
      });
    });
  };
  return (
    <View>
      <Button
        onPress={selectFile}
        style={{height: 50, width: 100, backgroundColor: 'red'}}></Button>
      <Button
        onPress={sendFile}
        style={{height: 50, width: 100, backgroundColor: 'yellow'}}
        disabled={!file}></Button>
    </View>
  );
};
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default SendPage;
