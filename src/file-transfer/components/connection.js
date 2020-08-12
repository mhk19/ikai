/* eslint-disable prettier/prettier */
// eslint-disable-next-line quotes
import React, {useState, useEffect, useRef} from 'react';
import DocumentPicker from 'react-native-document-picker';
import {View, StyleSheet, Button} from 'react-native';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
} from 'react-native-webrtc';
import {DocumentDirectoryPath, writeFile} from 'react-native-fs';

const configuration = {
  iceServers: [{url: 'stun:stun.1.google.com:19302'}],
};

const MAXIMUM_MESSAGE_SIZE = 65535;
const END_OF_FILE_MESSAGE = 'EOF';

const Connection = ({connection, updateConnection, channel, updateChannel}) => {
  const [socketOpen, setSocketOpen] = useState(false);
  const [socketMessages, setSocketMessages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUserName] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [users, setUsers] = useState([]);
  const [connectedTo, setConnectedTo] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [file, setFile] = useState(null);
  const connectedRef = useRef();
  const webSocket = useRef(null);

  useEffect(() => {
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
          setSocketOpen(true);
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
        case 'offer':
          onOffer(data);
          break;
        case 'answer':
          onAnswer(data);
          break;
        case 'candidate':
          onCandidate(data);
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
    setLoggingIn(true);
    send({
      type: 'login',
      username,
    });
  };

  const updateUsersList = ({user}) => {
    setUsers((prev) => [...prev, user]);
  };

  const removeUser = ({user}) => {
    setUsers((prev) => prev.filter((u) => u.username !== user));
  };

  const onLogin = ({success, message, users: loggedIn}) => {
    setLoggingIn(false);
    if (success) {
      //alert "logged in successfully"
      setIsLoggedIn(true);
      setUsers(loggedIn);
      let localConnection = new RTCPeerConnection(configuration);
      localConnection.onicecandidate = ({candidate}) => {
        let connectedTo = connectedRef.current;
        if (candidate && !!connectedTo) {
          send({
            name: connectedTo,
            type: 'candidate',
          });
        }
        localConnection.ondatachannel = (event) => {
          console.log('Data channel is created!');
          let receiveChannel = event.channel;
          receiveChannel.onopen = () => {
            console.log('Data channel is open and ready to be used.');
          };
          receiveChannel.binaryType = 'arraybuffer';
          receiveChannel.onmessage = handleDataChannelFileReceived;
          updateChannel(receiveChannel);
        };
        updateConnection(localConnection);
      };
    } else {
      //alert failed
    }
  };

  const onOffer = ({offer, name}) => {
    setConnectedTo(name);
    connectedRef.current = name;

    connection
      .setRemoteDescription(new RTCSessionDescription(offer))
      .then(() => connection.createAnswer())
      .then((answer) => connection.setLocalDescription(answer))
      .then(() =>
        send({type: 'answer', answer: connection.localDescription, name}),
      )
      .catch((e) => {
        console.log({e});
      });
  };

  const onAnswer = ({answer}) => {
    connection.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const onCandidate = ({candidate}) => {
    connection.addIceCandidate(new RTCIceCandidate(candidate));
  };

  const handleConnection = (name) => {
    var dataChannelOptions = {
      reliable: true,
    };

    let dataChannel = connection.createDataChannel('file');

    dataChannel.onerror = (error) => {
      console.log(error);
    };
    dataChannel.binaryType = 'arraybuffer';
    dataChannel.onmessage = handleDataChannelFileReceived;
    updateChannel(dataChannel);

    connection
      .createOffer()
      .then((offer) => connection.setLocalDescription(offer))
      .then(() =>
        send({type: 'offer', offer: connection.localDescription, name}),
      )
      .catch((e) => setAlert(e));
  };

  const toggleConnection = (userName) => {
    if (connectedRef.current === userName) {
      setConnecting(true);
      setConnectedTo('');
      connectedRef.current = '';
      setConnecting(false);
    } else {
      setConnecting(true);
      setConnectedTo(userName);
      connectedRef.current = userName;
      handleConnection(userName);
      setConnecting(false);
    }
  };

  const sendFile = () => {
    if (file) {
      channel.onopen = async () => {
        const arrayBuffer = await file.arrayBuffer();
        for (let i = 0; i < arrayBuffer.byteLength; i += MAXIMUM_MESSAGE_SIZE) {
          channel.send(arrayBuffer.slice(i, i + MAXIMUM_MESSAGE_SIZE));
        }
        channel.send(END_OF_FILE_MESSAGE);
      };
    }
  };

  const handleDataChannelFileReceived = ({data}) => {
    const receivedBuffers = [];
    try {
      if (data !== END_OF_FILE_MESSAGE) {
        receivedBuffers.push(data);
      } else {
        const arrayBuffer = receivedBuffers.reduce((acc, arraybuffer) => {
          const tmp = new Uint8Array(acc.byteLength + arraybuffer.byteLength);
          tmp.set(new Uint8Array(acc), 0);
          tmp.set(new Uint8Array(arraybuffer), acc.byteLength);
          return tmp;
        }, new Uint8Array());
        const blob = new Blob([arrayBuffer]);
        downloadFile(blob, channel.label);
      }
    } catch (err) {
      console.log('File transfer failed');
    }
  };

  const selectFile = () => {
    try {
      const res = DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setFile(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        alert('Cancelled from single doc picker');
      } else {
        alert(err);
        throw err;
      }
    }
  };

  const downloadFile = (bytes, name) => {
    let path = DocumentDirectoryPath + name;
    writeFile(path, bytes)
      .then((success) => {
        console.log('File written');
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  return (
    <View style={styles.container}>
      <Button onPress={selectFile} title="Select File" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Connection;
