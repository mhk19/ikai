import React, {useState, useEffect, useRef} from 'react';
import DocumentPicker from 'react-native-document-picker';
import {View, StyleSheet, Button, Text} from 'react-native';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
} from 'react-native-webrtc';
import {DocumentDirectoryPath, writeFile, stat} from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import {TextInput} from 'react-native-gesture-handler';

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
  const [receiver, setReceiver] = useState('');
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
        // case 'updateUsers':
        //   updateUsersList(data);
        //   break;
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
    console.log('logging in with name:', username);
    setLoggingIn(true);
    send({
      type: 'login',
      name: username,
    });
  };

  // const updateUsersList = ({user}) => {
  //   console.log(user.username, typeof user.username);
  //   setUsers(...users, user.username);
  // };

  const removeUser = ({user}) => {
    setUsers((prev) => prev.filter((u) => u.username !== user));
  };

  const onLogin = ({success, message, user: loggedIn}) => {
    setLoggingIn(false);
    if (success) {
      //alert "logged in successfully"
      setIsLoggedIn(true);
      //setUsers(JSON.stringify(loggedIn));
      let localConnection = new RTCPeerConnection(configuration);
      console.log('local connection', localConnection);
      localConnection.onicecandidate = ({candidate}) => {
        let connectedTo = connectedRef.current;
        if (candidate && !!connectedTo) {
          send({
            name: connectedTo,
            type: 'candidate',
            candidate: candidate,
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
      };
      updateConnection(localConnection);
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
        send({type: 'answer', answer: connection.localDescription, name: name}),
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
    console.log('datachannels');
    console.log(dataChannel);

    dataChannel.onerror = (error) => {
      console.log('datachannel error');
      console.log(error);
    };
    dataChannel.binaryType = 'arraybuffer';
    dataChannel.onmessage = handleDataChannelFileReceived;
    updateChannel(dataChannel);
    console.log('reached here');
    connection
      .createOffer()
      .then((desc) => {
        connection.setLocalDescription(desc).then(() => {
          send({type: 'offer', offer: connection.localDescription, name: name});
        });
      })
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
    // if (file) {
      // console.log('the selected file is:', file);
      // channel.onopen = async () => {
      //   const arrayBuffer = await file.arrayBuffer();
      //   for (let i = 0; i < 10; i++) {
          channel.send('hello! this is mahak');
        // }
        // channel.send(END_OF_FILE_MESSAGE);
      //};
    //}
  };

  const handleDataChannelFileReceived = ({data}) => {
    console.log(data);
    // const receivedBuffers = [];
    // try {
    //   if (data !== END_OF_FILE_MESSAGE) {
    //     receivedBuffers.push(data);
    //   } else {
    //     const arrayBuffer = receivedBuffers.reduce((acc, arraybuffer) => {
    //       const tmp = new Uint8Array(acc.byteLength + arraybuffer.byteLength);
    //       tmp.set(new Uint8Array(acc), 0);
    //       tmp.set(new Uint8Array(arraybuffer), acc.byteLength);
    //       return tmp;
    //     }, new Uint8Array());
    //     const blob = new Blob([arrayBuffer]);
    //     downloadFile(blob, channel.label);
    //   }
    // } catch (err) {
    //   console.log('File transfer failed');
    // }
  };

  const selectFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      // JSON.stringify(res);
      console.log(JSON.stringify(res));
      setFile(res);
      // console.log(readFile(file.uri));
      console.log('the selected file is:', file);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        alert('Cancelled from single doc picker');
      } else {
        console.log(err);
        throw err;
      }
    }
  };

  // const getPath = (uri) => {
  //   if (uri !== undefined) {
  //     const split = uri.split('/');
  //     const name = split.pop();
  //     const inbox = split.pop();
  //     const realPath = `${DocumentDirectoryPath}${inbox}/${name}`;
  //     return realPath;
  //   } else {
  //     console.log('uri not found');
  //   }
  // };

  const ReadFile = (path) => {
    console.log('called readfile');
    let realPath = '';
    let data = '';
    if (path !== null) {
      console.log('path is', path);
      stat(path)
        .then((stats) => {
          realPath = stats.originalFilepath;
          console.log(realPath);
          RNFetchBlob.fs
            .readStream(realPath, 'utf8', 4096)
            .then((ifstream) => {
              ifstream.open();
              ifstream.onData((chunk) => {
                console.log('reading file');
                data += chunk;
              });
              ifstream.onError((err) => {
                console.log('error in reading file', err);
              });
              ifstream.onEnd(() => {
                console.log('read successful');
              });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
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
      <TextInput onChangeText={(text) => setUserName(text)} value={username} />
      <Button
        onPress={() => {
          handleLogin();
        }}
        title="Login"
      />
      <Text>Online Users: {users}</Text>
      <TextInput onChangeText={(text) => setReceiver(text)} value={receiver} />
      <Button
        onPress={() => {
          handleConnection(receiver);
        }}
        title="Connect"
      />
        <Button
          title="Read File"
          onPress={() => {
            sendFile();
          }}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Connection;
