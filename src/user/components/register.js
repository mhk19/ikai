import React from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import {virgilCrypto} from 'react-native-virgil-crypto';
import AsyncStorage from '@react-native-community/async-storage';

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
    height: '42%',
    justifyContent: 'space-between',
  },
  textBox: {
    backgroundColor: 'white',
    borderColor: '#13C2C2',
    borderRadius: 500,
    borderWidth: 2,
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

  setPublicKey = async (name, key) => {
    AsyncStorage.setItem(`${name}_public_key`, key);
  };

  generateKeyPair = () => {
    const keyPair = virgilCrypto.generateKeys();
    console.log(keyPair);
    return keyPair;
  };

  setToken = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);
    } catch (e) {
      console.log(e);
    }
  };

  registerUser = () => {
    const keys = this.generateKeyPair();
    fetch('http://3a0b1b353ddb.ngrok.io/rest-auth/registration/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: {
        username: `${this.state.username}`,
        password1: `${this.state.password1}`,
        password2: `${this.state.password2}`,
        publicKey: `${keys.publicKey}`,
      },
    })
      .then((response) => {
        this.setToken(response.token);
        this.setPrivateKey(this.state.username, keys.privateKey);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
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
              onChangeText={this.setPassword}
            />
          </View>
          <View style={styles.submissionContainer}>
            <TouchableOpacity
              onPress={() => {
                this.registerUser;
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
