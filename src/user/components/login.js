import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage';
import {IKAISERVER} from '../../ikai/constants';
import {BreathingLoader} from 'react-native-indicator';
const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: '12%',
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
    height: '27%',
    justifyContent: 'space-between',
  },
  submissionContainer: {
    height: '30%',
    justifyContent: 'space-between',
  },
  textBox: {
    backgroundColor: 'white',
    borderColor: '#13C2C2',
    borderRadius: 500,
    borderWidth: 2,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'roboto',
  },
});

export class LoginComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      showLoader: false,
    };
  }
  getPrivateKey = async (name) => {
    try {
      const value = await AsyncStorage.getItem(`${name}_private_key`);
      return value != null ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  };

  getToken = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      return value != null ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  };

  getPublicKey = async (name) => {
    try {
      const value = await AsyncStorage.getItem(`${name}_public_key`);
      return value != null ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  };

  setToken = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);
      console.log('token saved in async storage.');
    } catch (e) {
      console.log(e);
    }
  };
  setUsername = async (username) => {
    try {
      await AsyncStorage.setItem('username', username);
      console.log('username stored in async storage');
    } catch (e) {
      console.log(e);
    }
  };
  loginUser = () => {
    this.setState({showLoader: true});
    if (this.getPrivateKey(this.state.username)) {
      console.log('login is clicked');
      fetch('http://' + IKAISERVER + '/rest-auth/login/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: `${this.state.username}`,
          password: `${this.state.password}`,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          this.setState({showLoader: false});
          if (data.key) {
            console.log(this.state.username);
            this.props.getPrivKey(this.state.username).then(() => {
              if (this.props.private_key) {
                console.log('user is logged in');
                this.setToken(data.key);
                this.setUsername(this.state.username);
                this.props.loginHandler(
                  this.state.username,
                  data.key,
                  this.props.private_key,
                );
              } else {
                Toast.show(
                  'This account was not set on this device. Private Key not found',
                );
              }
            });
          } else {
            Toast.show('Invalid Credentials, not authenticated.');
          }
        })
        .catch((error) => {
          console.log(error);
          Toast.show('Check your internet connection and try again.');
        });
    }
  };

  setUserName = (text) => {
    this.setState({username: text});
  };

  setPassword = (text) => {
    this.setState({password: text});
  };

  render() {
    return (
      <ImageBackground
        source={require('../../../assets/images/user/background.png')}
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
            </View>
            {/* <TouchableOpacity>
                <Text style={}>Forgot Password?</Text>
                </TouchableOpacity>
                </View> */}
            {this.state.showLoader && (
              <View style={{alignContent: 'center', alignItems: 'center'}}>
                <BreathingLoader
                  color={'#13C2C2'}
                  size={40}
                  strokeWidth={8}
                  frequency={800}></BreathingLoader>
              </View>
            )}
            <View style={styles.submissionContainer}>
              <TouchableOpacity
                onPress={() => {
                  this.loginUser();
                }}
                disabled={!(this.state.username && this.state.password)}
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
                  LOG IN
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
                  this.props.pageHandler('register');
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
                  SIGNUP
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

export default LoginComponent;
