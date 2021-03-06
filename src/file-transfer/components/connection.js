import React, {useState, useEffect, useRef} from 'react';
import DocumentPicker from 'react-native-document-picker';
import FilePickerManager from 'react-native-file-picker';
import {View, StyleSheet, Button, Text} from 'react-native';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
} from 'react-native-webrtc';
import {DocumentDirectoryPath, writeFile, stat} from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import {TextInput} from 'react-native-gesture-handler';
import RNFS from 'react-native-fs';
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
  let receivedBuffers = [];

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

  // const toggleConnection = (userName) => {
  //   if (connectedRef.current === userName) {
  //     setConnecting(true);
  //     setConnectedTo('');
  //     connectedRef.current = '';
  //     setConnecting(false);
  //   } else {
  //     setConnecting(true);
  //     setConnectedTo(userName);
  //     connectedRef.current = userName;
  //     handleConnection(userName);
  //     setConnecting(false);
  //   }
  // };

  const sendFile = () => {
    if (file) {
      console.log('the selected file is:', file);

      ReadFile(file);
    }
  };

  const handleDataChannelFileReceived = ({data}) => {
    try {
      if (data !== END_OF_FILE_MESSAGE) {
        receivedBuffers.push(data);
      } else if (data === END_OF_FILE_MESSAGE) {
        RNFetchBlob.fs
          .writeStream(RNFetchBlob.fs.dirs.DownloadDir + '/test2.pdf', 'base64')
          .then((stream) => {
            for (let i = 0; i < receivedBuffers.length; i++) {
              stream.write(receivedBuffers[i]);
            }
            console.log(receivedBuffers);
            console.log('File completely received');
            receivedBuffers = [];
            return stream.close();
          });
      } else {
        console.log('file cannot be received completely');
      }
    } catch (err) {
      console.log('File transfer failed');
    }
  };

  const selectFile = async () => {
    FilePickerManager.showFilePicker(null, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled file picker');
      } else if (response.error) {
        console.log('FilePickerManager Error: ', response.error);
      } else {
        setFile(response);
      }
    });
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
  const ReadFile = (file) => {
    const fileData = [];
    const realPath = file.path;
    if (realPath !== null) {
      console.log('path is', realPath);
      RNFetchBlob.fs
        .readStream(realPath, 'base64', MAXIMUM_MESSAGE_SIZE)
        .then((ifstream) => {
          ifstream.open();
          ifstream.onData((chunk) => {
            console.log('reading file');
            console.log(chunk);
            //fileData.push(chunk);
            channel.send(chunk);
          });
          ifstream.onError((err) => {
            console.log('error in reading file', err);
          });
          ifstream.onEnd(() => {
            channel.send(END_OF_FILE_MESSAGE);
            console.log('read successful');
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // const downloadFile = (bytes, name) => {
  //   let path = DocumentDirectoryPath + name;
  //   writeFile(path, bytes)
  //     .then((success) => {
  //       console.log('File written');
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //     });
  // };
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
        title="Select File"
        onPress={() => {
          selectFile();
        }}
      />
      <Button
        title="Send File"
        onPress={() => {
          sendFile(file);
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
