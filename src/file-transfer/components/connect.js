import React, {useState, useEffect, useRef} from 'react';
import {RTCPeerConnection} from 'react-native-webrtc';
import {View, Image, Text, StyleSheet, ScrollView} from 'react-native';
import ContactThumbnail from './contactThumbnail';
import WaitingPage from './waiting';
import ErrorPage from './errorPage';

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
  showingContactsDesc: {
    marginTop: 10,
    color: '#595959',
    fontFamily: 'roboto',
    fontStyle: 'normal',
    fontSize: 16,
    marginRight: 35,
  },
});

const configuration = {
  iceServers: [{url: 'stun:stun.1.google.com:19302'}],
};
export const Connect = (props) => {
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
    return () => webSocket.current.close();
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
        case 'leave':
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
    console.log(users);
  };

  const removeUser = ({user}) => {
    setUsers((prev) => prev.filter((u) => u.username !== user.username));
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
          <WaitingPage desc="Establishing connection" />
        ) : (
          <ErrorPage />
        )
      ) : (
        <View>
          <Text style={styles.showingContactsDesc}>
            Showing all available contacts. Tap to connect.
          </Text>
          {users.length !== 0 ? (
            <ScrollView style={{marginLeft: 20}}>
              {users.map((user) => {
                console.log(user);
                return <ContactThumbnail name={user.username} />;
              })}
            </ScrollView>
          ) : (
            <Text>Searching for online users.</Text>
          )}
        </View>
      )}
    </View>
  );
};

export default Connect;
