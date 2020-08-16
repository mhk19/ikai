import React, {useState, useEffect, useRef} from 'react';
import {RTCPeerConnection} from 'react-native-webrtc';
import {View, Image, Text, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
});

const configuration = {
  iceServers: [{url: 'stun:stun.1.google.com:19302'}],
};
export const Connect = (file, navigation) => {
  const [socketMessages, setSocketMessages] = useState([]);
  const [username, setUserName] = useState('');
  const [users, setUsers] = useState([]);
  const webSocket = useRef(null);
  const [connection, updateConnection] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setUserName('mahak');
    webSocket.current = new WebSocket(
      'ws://excelsior-signalling-server.herokuapp.com/',
    );
    console.log('Connected to websocket');
    webSocket.current.onmessage = (message) => {
      const data = JSON.parse(message.data);
      setSocketMessages((prev) => [...prev, data]);
      console.log(message);
    };
    webSocket.current.onclose = () => {
      console.log('closing the websocket');
      webSocket.current.close();
    };
    console.log('file', file);
  }, []);

  useEffect(() => {
    let data = socketMessages.pop();
    if (data) {
      switch (data.type) {
        case 'connect':
          handleLogin();
          break;
        case 'login':
          onLogin(data);
          break;
        case 'updateUsers':
          updateUsersList(data);
          break;
        case 'removeUser':
          removeUser(data);
          break;
        default:
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketMessages]);

  const send = (data) => {
    webSocket.current.send(JSON.stringify(data));
  };

  const handleLogin = () => {
    console.log('logging in with name:', username);
    send({
      type: 'login',
      name: username,
    });
  };

  const updateUsersList = ({user}) => {
    console.log(user.username, typeof user.username);
    setUsers((prev) => [...prev, user]);
  };

  const removeUser = ({user}) => {
    setUsers((prev) => prev.filter((u) => u.username !== user));
  };

  const onLogin = ({success, message, users: loggedIn}) => {
    if (success) {
      setUsers(loggedIn);
      let localConnection = new RTCPeerConnection(configuration);
      console.log('local connection', localConnection);
      updateConnection(localConnection);
      setConnected(true);
    } else {
      console.log(message);
      setError(true);
    }
  };
  return (
    <View style={styles.outerContainer}>
      {!connected ? (
        !error ? (
          <View style={styles.innerContainer}>
            <Image
              style={styles.imageContainer}
              source={require('../assets/network.png')}
            />
            <Text
              style={{
                color: '#979797',
                fontFamily: 'roboto',
                fontStyle: 'normal',
                fontSize: 16,
              }}>
              Establishing Connection
            </Text>
          </View>
        ) : (
          <View style={styles.innerContainer}>
            <Image
              style={styles.imageContainer}
              source={require('../assets/networkfail.png')}
            />
            <Text
              style={{
                color: '#FF0000',
                fontFamily: 'roboto',
                fontStyle: 'normal',
                fontSize: 16,
                textAlign: 'center'
              }}>
              Failed. Please check your internet connection and try again.
            </Text>
          </View>
        )
      ) : (
        <View>
          <Text>Push to available contacts page</Text>
        </View>
      )}
    </View>
  );
};

export default Connect;
