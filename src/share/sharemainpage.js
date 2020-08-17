import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {ActionPage} from '../file-transfer/components/action';

const styles = StyleSheet.create({
  outerContainer: {
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
    height: '80%',
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
    flexDirection: 'row',
    fontStyle: 'normal',
    fontFamily: 'roboto',
    fontSize: 18,
    alignItems: 'center',
  },
  onlineButton: {
    minHeight: '40%',
    backgroundColor: '#13C2C2',
    width: '43%',
    alignItems: 'center',
    borderRadius: 5,
  },
  offlineButton: {
    backgroundColor: 'white',
    minHeight: '40%',
    width: '43%',
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
    marginTop: '0%',
  },
});
export class ShareMainPage extends React.Component {
  render() {
    return (
      <View style={styles.outerContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.upperContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={require('./assets/share_main.png')}
                style={styles.image}></Image>
            </View>
            <View style={styles.descContainer}>
              <Text
                style={{
                  color: '#979797',
                  fontSize: 22,
                  fontFamily: 'roboto',
                  margin: '5%',
                  textAlign: 'center',
                }}>
                Share your documents in a fast and secure way. Choose a way to
                share file.
              </Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.onlineButton}
              onPress={() => {
                this.props.navigation.push('shareOnlineActionPage', {});
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 20,
                  fontFamily: 'roboto',
                  marginTop: '7%',
                }}>
                ONLINE
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                color: '#979797',
                backgroundColor: 'white',
                width: '14%',
                height: '33%',
                textAlignVertical: 'center',
                textAlign: 'center',
                fontSize: 20,
                fontFamily: 'roboto',
              }}>
              or
            </Text>
            <TouchableOpacity
              style={styles.offlineButton}
              onPress={() => this.props.navigation.push('offlinemainscreen')}>
              <Text
                style={{
                  color: '#13C2C2',
                  fontSize: 20,
                  fontFamily: 'roboto',
                  marginTop: '7%',
                }}>
                OFFLINE
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default ShareMainPage;
