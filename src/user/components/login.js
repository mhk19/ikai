import React from 'react';
import {StyleSheet, TextInput, Text, TouchableOpacity} from 'react-native';
import {View} from 'native-base';
import Background from '../assets/background.png';
import AsyncStorage from '@react-native-community/async-storage';
import App from '../../../App';
import axios from 'axios';
const styles = StyleSheet.create({
  outerContainer: {
    // backgroundImage: `url(${Background})`,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    alignContent: 'center',
  },
  formContainer: {
    height: '60%',
    width: '72%',
    marginLeft: '7%',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  buttonContainer: {},
  submissionContainer: {},
  textBox: {},
});

export class LoginComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
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
    } catch (e) {
      console.log(e);
    }
  };

  loginUser = () => {
    if (this.getPrivateKey(this.state.username)) {
      console.log('login is clicked');
      fetch('http://32cfcc07afc2.ngrok.io/rest-auth/login/', {
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
        .then((response) => {
          if (response.status !== 200) {
            console.log(response);
            //handle errors}
          } else {
            console.log('user is logged in');
            this.setToken(response.data.token);
            // set user variable also
            this.props.loginHandler();
          }
        })
        .catch((error) => {
          console.log(error);
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
      <View style={styles.outerContainer}>
        <View style={styles.formContainer}>
          <View style={styles.buttonContainer}>
            <TextInput
              style={styles.textBox}
              placeholder="Username"
              onChangeText={this.setUserName}
            />
            <TextInput
              style={styles.textBox}
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={this.setPassword}
            />
            {/* <TouchableOpacity>
              <Text style={}>Forgot Password?</Text>
            </TouchableOpacity>
          </View> */}
            <TouchableOpacity
              onPress={() => {
                this.loginUser();
              }}
              disabled={!(this.state.username && this.state.password)}>
              <Text
                style={{
                  color: '#13C2C2',
                  fontSize: 18,
                  fontFamily: 'roboto',
                  marginTop: '3%',
                }}>
                LOG IN
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
              onPress={() => {
                this.props.pageHandler('register');
              }}
              style={{
                backgroundColor: '#13C2C2',
                fontSize: 18,
                fontFamily: 'roboto',
                marginTop: '3%',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 18,
                  fontFamily: 'roboto',
                  marginTop: '3%',
                }}>
                SIGNUP
              </Text>
            </TouchableOpacity>
          </View>
          {/* <Image source={require('../assets/require.png')}></Image> */}
        </View>
      </View>
    );
  }
}

export default LoginComponent;
