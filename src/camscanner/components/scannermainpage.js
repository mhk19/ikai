import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import ScanbotSDK from 'react-native-scanbot-sdk';
import {Pages} from '../model/Pages';
import {ImageUtils} from '../utils/imageutils';
import {BaseScreen} from '../utils/BaseScreen';
export const CamScannerColour = '#13C2C2';

const styles = StyleSheet.create({
  outerContainer: {
    // maxWidth: '88%',
    // backgroundColor: 'red',
    // maxHeight: '70%',
    // marginLeft: '6%',
    // marginTop: '30%',
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  innerContainer: {
    height: '60%',
    width: '86%',
    marginLeft: '7%',
    backgroundColor: 'white',
    maxHeight: '70%',
  },
  upperContainer: {
    height: '70%',
    backgroundColor: 'white',
  },
  descContainer: {
    height: '30%',
    margin: 0,
  },
  imageContainer: {
    height: '70%',
  },
  buttonContainer: {
    height: '30%',
    backgroundColor: 'white',
    flexDirection: 'column',
    fontStyle: 'normal',
    fontFamily: 'roboto',
    fontSize: 18,
    alignItems: 'center',
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
    resizeMode: 'contain',
    flex: 2,
    width: '80%',
    marginLeft: '10%',
    marginTop: '-10%',
  },
});

export class ScannerMainPage extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
      navigation: props.navigation,
    };
  }
  render() {
    return (
      <View style={styles.outerContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.upperContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={require('../assets/scanner_main.png')}
                style={styles.image}></Image>
            </View>
            <View style={styles.descContainer}>
              <Text
                style={{
                  color: '#979797',
                  fontSize: 16,
                  fontFamily: 'roboto',
                  margin: '5%',
                  textAlign: 'center',
                }}>
                Relax! All your documents are safe with you. We don’t access the
                documents you scan.
              </Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => {
                this.startDocumentScanner(this.props);
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 18,
                  fontFamily: 'roboto',
                  marginTop: '3%',
                }}>
                SCAN
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                color: '#979797',
                backgroundColor: 'white',
                width: '100%',
                height: '33%',
                textAlignVertical: 'center',
                textAlign: 'center',
                fontSize: 18,
                fontFamily: 'roboto',
              }}>
              or
            </Text>
            <TouchableOpacity
              style={styles.importButton}
              onPress={() => {
                this.importImageAndDetectDocument(this.props);
              }}>
              <Text
                style={{
                  color: '#13C2C2',
                  fontSize: 18,
                  fontFamily: 'roboto',
                  marginTop: '3%',
                }}>
                Import Files
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
  async importImageAndDetectDocument(props) {
    const result = await ImageUtils.pickFromGallery();
    // TODO: Add an error here.
    console.log(result);
    let page = await ScanbotSDK.createPage(result.uri);
    page = await ScanbotSDK.detectDocumentOnPage(page);
    Pages.add(page);
    props.navigation.push('imageResults');
  }
  async startDocumentScanner(props) {
    const config = {
      // Customize colors, text resources, etc..
      polygonColor: '#00ffff',
      bottomBarBackgroundColor: '#13C2C2',
      topBarBackgroundColor: '#13C2C2',
      cameraBackgroundColor: '#13C2C2',
      orientationLockMode: 'PORTRAIT',
      pageCounterButtonTitle: '%d Page(s)',
      multiPageEnabled: true,
      ignoreBadAspectRatio: true,
      autoSnappingSensitivity: 0.85,
      // documentImageSizeLimit: { width: 2000, height: 3000 },
      // maxNumberOfPages: 3,
      // See further config properties ...
    };
    const result = await ScanbotSDK.UI.startDocumentScanner(config);
    if (result.status === 'OK') {
      Pages.addList(result.pages);
      props.navigation.push('imageResults');
    } else {
      console.log('Scanner Returned With an error.');
      //TODO: Show warning here too.
    }
  }
}
