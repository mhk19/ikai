import React from 'react';
import {StyleSheet, TextInput, Text} from 'react-native';
import {View} from 'native-base';
import Background from '../assets/background.png';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import App from '../../../App';

const styles = StyleSheet.create({
  outerContainer: {
    backgroundImage: `url(${Background})`,
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
    fetch('http://3a0b1b353ddb.ngrok.io/rest-auth/login/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: {
        username: `${this.state.username}`,
        password: `${this.state.password}`,
      },
    })
      .then((response) => {
        console.log(response);
        this.setToken(response.token);
        App.render();
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

export class LoginComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    username: null,
    password: null,
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
            <TouchableOpacity onPress={this.loginUser()}>
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
              onPress={null}
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
