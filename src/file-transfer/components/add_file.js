import React, {useState} from 'react';
import FilePickerManager from 'react-native-file-picker';
import {View, Image, Text, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

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
    alignItems: 'center',
  },
  shareImageContainer: {
    marginTop: '20%',
    height: '30%',
    resizeMode: 'contain',
  },
  descContainer: {
    marginTop: '5%',
    fontFamily: 'roboto',
    fontStyle: 'normal',
    fontSize: 16,
    textAlign: 'center',
    color: '#979797',
  },
  emptyFileContainer: {
    backgroundColor: '#FAFAFA',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 2,
    flexDirection: 'column',
    marginTop: '5%',
    width: 350,
    height: 80,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: 'rgba(19, 194, 194, 0.3)',
    borderRadius: 2,
    color: 'white',
    width: 350,
    height: 40,
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
    flex: 0.2,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  fileContainer: {
    flexDirection: 'row',
    width: 300,
    height: 70,
    marginTop: 20,
    justifyContent: 'center',
  },
  filenameContainer: {
    flex: 0.7,
    fontFamily: 'roboto',
    fontStyle: 'normal',
    fontSize: 14,
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
    width: 275,
    height: 40,
    fontFamily: 'roboto',
    fontStyle: 'normal',
    fontSize: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});

export const AddFile = (props) => {
  const [file, setFile] = useState(null);
  const [fileExtension, setFileExtension] = useState('');
  const [fileName, setFileName] = useState('');

  const getFileExtension = () => {
    let temp = fileName.split('.');
    return temp[temp.length - 1];
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
        setFileName(response.fileName);
        setFileExtension(getFileExtension(fileName));
      }
    });
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <Image
          style={styles.shareImageContainer}
          source={require('../assets/share.png')}
        />
        <Text style={styles.descContainer}>
          Start by choosing file you want to share.
        </Text>
        {fileName === '' ? (
          <View>
            <TouchableOpacity
              style={styles.emptyFileContainer}
              onPress={() => {
                selectFile();
              }}>
              <Image source={require('../assets/plus.png')} />
              <Text style={{color:'#979797'}}>ADD FILE</Text>
            </TouchableOpacity>
            <View style={styles.disabledButton}>
              <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
                SEND
              </Text>
            </View>
          </View>
        ) : (
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <TouchableOpacity
              style={styles.fileContainer}
              onPress={() => {
                selectFile();
              }}>
              <View style={styles.iconContainer}>
                <Image source={require('../assets/video_icon.png')} />
                <Text style={{color:'#979797'}}>PDF</Text>
              </View>
              <View style={styles.filenameContainer}>
                <Text style={{color: '#979797'}}>{fileName}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sendContainer} onPress={() => {}}>
              <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
                SEND
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};
export default AddFile;
