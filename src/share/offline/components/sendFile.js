import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    //marginTop: 10,
    resizeMode: 'contain',
    marginBottom: 10,
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
  descContainer: {
    fontFamily: 'roboto',
    fontStyle: 'normal',
    fontSize: 16,
    flexDirection: 'row',
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

export class SendFileOffline extends React.Component {   

    render() {
    return (
      <View style={styles.outerContainer}>
        {!this.props.sent ? (
          <View>
            <Image
              style={styles.imageContainer}
              source={require('../assets/sendfile.png')}
            />
            <Text style={(styles.descContainer, {color: '#979797'})}>
              Sending your file!
            </Text>
            <EatBeanLoader color={'#13C2C2'} size={40}></EatBeanLoader>
          </View>
        ) : (
          <View style={{alignItems: 'center'}}>
            <Image
              style={styles.imageContainer}
              source={require('../assets/sentfile.png')}
            />
            <Text style={(styles.descContainer, {color: '#13C2C2'})}>
              File successfully sent!
            </Text>
          </View>
        )}
        <View style={styles.fileContainer}>
          <View style={styles.iconContainer}>
            <Image source={require('../assets/video_icon.png')} />
            <Text style={{color: '#979797'}}>PDF</Text>
          </View>
          <View style={styles.filenameContainer}>
            <Text style={{color: '#979797'}}>{this.props.fileName}</Text>
          </View>
        </View>
        {this.props.sent ? (
          <TouchableOpacity style={styles.buttonContainer}>
            <Text
              style={{
                fontFamily: 'roboto',
                fontStyle: 'normal',
                fontSize: 14,
                color: 'white',
              }}>
              SEND ANOTHER FILE
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
        )}
      </View>
    );
  }
}

export default SendFileOffline;