import React from 'react';
import {StyleSheet, TextInput, Text} from 'react-native';
import View from 'native-base';
import Background from '../assets/background.png';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {virgilCrypto} from 'react-native-virgil-crypto';
import App from '../../../App';
import AsyncStorage from '@react-native-community/async-storage';

const styles = StyleSheet.create({
  outerContainer: {
    backgroundImage: `url(${Background})`,
    alignContent: 'center',
    flex: 1,
  },
  formContainer: {
    height: '60%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  textBox: {
    borderColor: '#13C2C2',
    borderRadius: '5%',
  },
  submissionContainer: {
    flexDirection: 'column',
    marginBottom: '0',
  },
  button: {},
});

export class RegisterComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    username: null,
    password1: null,
    password2: null,
  };

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
        App.render();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  render() {
    return (
      <View style={styles.outerContainer}>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
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
            <TextInput
              style={styles.textBox}
              placeholder="Confirm Password"
              secureTextEntry={true}
              onChangeText={this.setPassword}
            />
            <View style={styles.submissionContainer}>
              <TouchableOpacity
                onPress={() => {
                  this.registerUser;
                }}>
                <Text style={null}>SIGNUP</Text>
              </TouchableOpacity>
              <Text style={null}>or</Text>
              <TouchableOpacity onPress={() => {}}>
                <Text style={null}>LOGIN</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* <Image source={require('../assets/require.png')}></Image> */}
        </View>
      </View>
    );
  }
}

export default RegisterComponent;
