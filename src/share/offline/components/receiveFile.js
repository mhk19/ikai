import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { color } from 'react-native-reanimated';
import RecWaitingPage from './recWaitingPage';
const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  },
  imageContainer: {
    // marginTop: 10,
    resizeMode: 'contain',
    marginBottom: 10,
    height: 200,
  },
  iconImgContainer: {
    // marginTop: 10,
    resizeMode: 'contain',
    height: 35,
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
  descContainer1: {
    fontFamily: 'roboto',
    fontStyle: 'normal',
    fontSize: 20,
    flexDirection: 'row',
    textAlign: 'center',
    color: '#979797',
  },
  descContainer2: {
    fontFamily: 'roboto',
    fontStyle: 'normal',
    fontSize: 20,
    flexDirection: 'row',
    textAlign: 'center',
    color: '#13C2C2',
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
  pgOuterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    width: 300,
  },
  pgInnerContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 100,
    width: 300,
    marginRight: '3%',
  },
  progressContainer: {
    backgroundColor: '#13C2C2',
    alignItems: 'center',
  },
  buttonContainer: {
    backgroundColor: '#13C2C2',
    height: 40,
    width: 300,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export class ReceiveFileOffline extends React.Component {
  render() {
    return (
      <View style={styles.outerContainer}>
        {!this.props.sent ? (
          <RecWaitingPage desc={'Receiving File...'} />
        ) : (
            <View style={{ alignItems: 'center' }}>
              <Image
                style={styles.imageContainer}
                source={require('../assets/files.png')}
              />
              <Text style={(styles.descContainer2)}>
                File successfully received!
            </Text>
              <Text style={(styles.descContainer2)}>
                Check your Downloads folder
            </Text>
            </View>
          )}
        <View style={styles.fileContainer}>
          <View style={styles.iconContainer}>
            <Image source={require('../assets/file_icon.png')}
              style={styles.iconImgContainer}
            />
            <Text style={{ color: '#979797' }}>FILE</Text>
          </View>
          <View style={styles.filenameContainer}>
            <Text style={{ color: '#979797' }}>{this.props.fileName}</Text>
          </View>
        </View>
        {/* {this.props.sent ? (
          <TouchableOpacity style={styles.buttonContainer}>
            <Text
              style={{
                fontFamily: 'roboto',
                fontStyle: 'normal',
                fontSize: 14,
                color: 'white',
              }}>
              SEND FILE
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.pgOuterContainer}>
            <View style={styles.pgInnerContainer}>
              <View>
                <Text>{this.props.percentage}%</Text>
              </View>
            </View>
            <TouchableOpacity style={{marginLeft: '5%', marginTop: '8%'}}>
              <Image source={require('../assets/cancel.png')} />
            </TouchableOpacity>
          </View>
        )} */}
      </View>
    );
  }
}

export default ReceiveFileOffline;
