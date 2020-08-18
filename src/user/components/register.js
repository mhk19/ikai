import React from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {RSA} from 'react-native-rsa-native';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import {IKAISERVER} from '../../ikai/constants';
import {BreathingLoader} from 'react-native-indicator';

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: '15%',
  },
  formContainer: {
    height: '60%',
    width: '72%',
    justifyContent: 'space-between',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  inputContainer: {
    height: '40%',
    justifyContent: 'space-between',
  },
  textBox: {
    backgroundColor: 'white',
    borderColor: '#13C2C2',
    borderRadius: 500,
    borderWidth: 2,
    textAlign: 'center',
    fontSize: 20,
  },
  submissionContainer: {
    height: '30%',
    justifyContent: 'space-between',
  },
});

export class RegisterComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password1: null,
      password2: null,
      showLoader: false,
    };
  }

  setUserName = (text) => {
    this.setState({username: text});
  };

  setPassword = (text) => {
    this.setState({password1: text});
  };

  setConfirmedPassword = (text) => {
    this.setState({password2: text});
  };

  generateKeyPair = async () => {
    const keys = await RSA.generateKeys(4096); // set key size
    return keys;
  };

  setToken = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);
    } catch (e) {
      console.log(e);
    }
  };

  registerUser = async () => {
    this.setState({showLoader: true});
    if (this.state.password1 !== this.state.password2) {
      console.log(this.state.password1);
      console.log(this.state.password2);
      Toast.show('Your Passwords do not match');
      return;
    }
    const keys = await this.generateKeyPair();
    console.log('keys');
    console.log(keys);
    console.log('keys');
    fetch('http://' + IKAISERVER + '/rest-auth/registration/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // 'X-CSRF-TOKEN': getCookie('CSRF-TOKEN'),
      },
      body: JSON.stringify({
        username: `${this.state.username}`,
        password1: `${this.state.password1}`,
        password2: `${this.state.password2}`,
        publickey: keys.public,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({showLoader: false});
        console.log(data);
        if (data.key) {
          this.props.setPrivateKey(this.state.username, keys.private);
          this.props.pageHandler('login');
        }
        if (data.detail) {
          Toast.show(data.detail);
        }
        if (data.username) {
          data.username.map((err) => {
            Toast.show(err);
          });
        } else if (data.password1) {
          data.password1.map((err) => {
            Toast.show(err);
          });
        } else if (data.non_field_errors) {
          non_field_errors.map((err) => {
            Toast.show(err);
          });
        }
        // this.setToken(response.token);
        // this.setPrivateKey(this.state.username, keys.privateKey);
        console.log(data);
      })
      .catch((error) => {
        Toast.show('Please check your internet connection and try again');
        console.log(error);
        this.setState({showLoader: false});
      });
  };

  render() {
    return (
      <ImageBackground
        source={require('../assets/background.png')}
        style={styles.background}>
        <View style={styles.outerContainer}>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textBox}
                placeholder="Username"
                placeholderTextColor="rgba(19, 194, 194, 0.5)"
                onChangeText={this.setUserName}
              />
              <TextInput
                style={styles.textBox}
                placeholder="Password"
                placeholderTextColor="rgba(19, 194, 194, 0.5)"
                secureTextEntry={true}
                onChangeText={this.setPassword}
              />
              <TextInput
                style={styles.textBox}
                placeholder="Confirm Password"
                placeholderTextColor="rgba(19, 194, 194, 0.5)"
                secureTextEntry={true}
                onChangeText={this.setConfirmedPassword}
              />
            </View>
            {this.state.showLoader && (
              <View style={{alignContent: 'center', alignItems: 'center'}}>
                <BreathingLoader
                  color={'#13C2C2'}
                  size={30}
                  strokeWidth={8}
                  frequency={800}></BreathingLoader>
              </View>
            )}
            <View style={styles.submissionContainer}>
              <TouchableOpacity
                onPress={() => {
                  this.registerUser();
                }}
                style={{
                  borderRadius: 500,
                  borderColor: '#13C2C2',
                  backgroundColor: '#13C2C2',
                  borderWidth: 2,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 22,
                    fontFamily: 'roboto',
                    padding: '3%',
                    textAlign: 'center',
                    textAlignVertical: 'center',
                  }}>
                  SIGNUP
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  color: '#979797',
                  width: '100%',
                  textAlignVertical: 'center',
                  textAlign: 'center',
                  fontSize: 16,
                  fontFamily: 'roboto',
                }}>
                or
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.props.pageHandler('login');
                }}
                style={{
                  borderColor: '#13C2C2',
                  borderRadius: 500,
                  borderWidth: 2,
                }}>
                <Text
                  style={{
                    color: '#13C2C2',
                    fontSize: 16,
                    padding: '5%',
                    fontFamily: 'roboto',
                    textAlignVertical: 'center',
                    textAlign: 'center',
                  }}>
                  LOGIN
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

export default RegisterComponent;
