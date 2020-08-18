import React, {useState, useEffect} from 'react';
import FilePickerManager from 'react-native-file-picker';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {ScreenStackHeaderCenterView} from 'react-native-screens';
import {EatBeanLoader} from 'react-native-indicator';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-simple-toast';
const MAXIMUM_BUFFER_SIZE = 4095;
const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  innerContainer: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  shareImageContainer: {
    marginTop: '20%',
    height: '30%',
    resizeMode: 'contain',
  },
  descContainer1: {
    marginTop: '10%',
    fontFamily: 'roboto',
    fontStyle: 'normal',
    fontSize: 20,
    textAlign: 'center',
    color: '#979797',
  },
  descContainer2: {
    marginTop: '10%',
    fontFamily: 'roboto',
    fontStyle: 'normal',
    fontSize: 20,
    textAlign: 'center',
    color: '#13C2C2',
  },
  emptyFileContainer: {
    backgroundColor: '#FAFAFA',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 2,
    flexDirection: 'column',
    marginTop: '5%',
    width: '80%',
    height: '25%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  upperContainer: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: 'rgba(19, 194, 194, 0.3)',
    borderRadius: 2,
    color: 'white',
    width: '80%',
    height: '15%',
    fontFamily: 'roboto',
    fontStyle: 'normal',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  iconContainer: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D9D9D9',
    borderRadius: 2,
    alignItems: 'center',
    flex: 0.3,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  fileContainer: {
    flexDirection: 'row',
    width: '80%',
    height: '25%',
    marginTop: '5%',
    justifyContent: 'center',
  },
  filenameContainer: {
    flex: 0.7,
    fontFamily: 'roboto',
    fontStyle: 'normal',
    fontSize: 18,
    borderStyle: 'solid',
    borderColor: '#D9D9D9',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendContainer: {
    backgroundColor: '#13C2C2',
    borderRadius: 2,
    color: 'white',
    width: '80%',
    height: '15%',
    fontFamily: 'roboto',
    fontStyle: 'normal',
    fontSize: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: '50%',
  },
});

export const SendPage = (props) => {
  const [file, setFile] = useState(null);
  const [fileExtension, setFileExtension] = useState('');
  const [fileName, setFileName] = useState('');
  const [connected, setConnected] = useState(false);
  const [sent, setSent] = useState(false);
  const data = props.route.params;
  const getFileExtension = () => {
    let temp = fileName.split('.');
    return temp[temp.length - 1];
  };
  useEffect(() => {
    if (!sent) {
      return;
    }
    Toast.show('File shared! Continue enjoying ikai!');
    Toast.show('Redirecting You Back');
    sleep(5000).then(() => {
      console.log('closing the client');
      props.route.params.client.destroy();
      props.route.params.navigation.navigate('shareMainscreen');
    });
  }, [sent]);
  const selectFile = async () => {
    FilePickerManager.showFilePicker(null, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled file picker');
      } else if (response.error) {
        console.log('FilePickerManager Error: ', response.error);
      } else {
        setFile(response);
        setFileName(response.fileName);
        setFileExtension(getFileExtension(fileName));
      }
    });
  };
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  const ReadFile = () => {
    const realPath = file.path;
    if (realPath !== null) {
      console.log('path is', realPath);
      RNFetchBlob.fs
        .readStream(realPath, 'base64', MAXIMUM_BUFFER_SIZE)
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
            setSent(true);
            console.log('read successful');
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setConnected(true);
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
    <View style={styles.outerContainer}>
      {!sent && (
        <View style={styles.innerContainer}>
          <Image
            style={styles.shareImageContainer}
            source={require('../assets/share.png')}
          />
          <Text style={styles.descContainer1}>
            Start by choosing file you want to share.
          </Text>
          {fileName === '' && (
            <View style={styles.upperContainer}>
              <TouchableOpacity
                style={styles.emptyFileContainer}
                onPress={() => {
                  selectFile();
                }}>
                <Image source={require('../assets/plus.png')} />
                <Text style={{color: '#979797'}}>ADD FILE</Text>
              </TouchableOpacity>
              <View style={styles.disabledButton}>
                <Text
                  style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
                  SEND
                </Text>
              </View>
            </View>
          )}
          {fileName !== '' && (
            <View style={styles.upperContainer}>
              <TouchableOpacity
                style={styles.fileContainer}
                onPress={() => {
                  selectFile();
                }}>
                <View style={styles.iconContainer}>
                  <Image source={require('../assets/video_icon.png')} />
                  <Text style={{color: '#979797'}}>FILE</Text>
                </View>
                <View style={styles.filenameContainer}>
                  <Text style={{color: '#979797'}}>{fileName}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sendContainer}
                onPress={() => {
                  sendFile();
                }}>
                <Text
                  style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
                  SEND
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      {sent && !connected && (
        <View style={styles.innerContainer}>
          <Image
            style={styles.imageContainer}
            source={require('../assets/sendfile.png')}
          />
          <Text style={styles.descContainer1}>Sending your file!</Text>
        </View>
      )}
      {sent && connected && (
        <View style={{alignItems: 'center'}}>
          <Image
            style={styles.imageContainer}
            source={require('../assets/sentfile.png')}
          />
          <Text style={styles.descContainer2}>File successfully sent!</Text>
        </View>
      )}
    </View>
  );
};
export default SendPage;
