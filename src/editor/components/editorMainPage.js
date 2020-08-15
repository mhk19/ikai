import React from 'react';
import {VESDK} from 'react-native-videoeditorsdk';
import {PESDK} from 'react-native-photoeditorsdk';
import {StyleSheet, View, Image, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import FilePickerManager from 'react-native-file-picker';

const styles = StyleSheet.create({
  outerContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  innerContainer: {
    backgroundColor: 'white',
    width: '86%',
    height: '50%',
    marginLeft: '7%',
  },
  graphicsContainer: {
    height: '72%',
    backgroundColor: 'white',
  },
  imageContainer: {
    height: '72%',
  },
  image: {
    // to be specified once the image gets finalised in the design
  },
  descrContainer: {
    height: '28%',
    margin: 0,
  },
  buttonContainer: {
    height: '28%',
    backgroundColor: 'white',
    fontStyle: 'normal',
    fontFamily: 'roboto',
    fontSize: 18,
  },
  button: {
    minHeight: '10%',
    backgroundColor: '#13C2C2',
    height: '75%',
    alignItems: 'center',
    borderRadius: 5,
  },
});
export class EditorMainPage extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    file: null,
  };
  render() {
    return (
      <View style={styles.outerContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.graphicsContainer}>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={null}></Image>
            </View>
            <View style={styles.descrContainer}>
              <Text
                style={{
                  color: '#979797',
                  fontSize: 16,
                  fontFamily: 'roboto',
                  margin: '5%',
                  textAlign: 'center',
                }}>
                Give the cinematic feel to your photos, start editing now.
              </Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.LoadModel();
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 18,
                  fontFamily: 'roboto',
                  marginTop: '3%',
                }}>
                START EDITING
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
  async LoadModel() {
    FilePickerManager.showFilePicker(null, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled file picker');
      } else if (response.error) {
        console.log('FilePickerManager Error: ', response.error);
      } else {
        console.log('here we are, lost..');
        this.setState({
          file: response,
        });
        this.StartEditing();
        console.log(this.state.file.type);
      }
    });
  }
  StartEditing() {
    if (
      this.state.file.type == 'image/jpeg' ||
      this.state.file.type == 'image/png'
    ) {
      PESDK.openEditor(this.state.file.path);
    } else if (
      this.state.file.type == 'video/mp4' ||
      this.state.file.type == 'video/mkv'
    ) {
      VESDK.openEditor(this.state.file.path);
    } else {
      console.log('Wrong file selected');
    }
  }
}

export default EditorMainPage;
