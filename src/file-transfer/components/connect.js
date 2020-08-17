import React, {useState, useEffect, useRef} from 'react';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
} from 'react-native-webrtc';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import ContactThumbnail from './contactThumbnail';
import ReceiveRequests from './receiveRequests';
import WaitingPage from './waiting';
import ErrorPage from './errorPage';
import SendFilePage from './send_file';

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

const MAXIMUM_MESSAGE_SIZE = 65535;
const END_OF_FILE_MESSAGE = 'EOF';

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
  const [connectedTo, setConnectedTo] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [selectingReceiver, setSelectingReceiver] = useState(false);
  const [clientType, setClientType] = useState('');
  const [channel, updateChannel] = useState(null);
  const [error, setError] = useState(false);
  const [senders, setSenders] = useState([]);
  const [selectingSender, setSelectingSender] = useState(true);
  const connectedRef = useRef();
  let receivedBuffers = [];

  useEffect(() => {
    setUserName('mahak');
    if (props.route.params.file !== undefined) {
      setClientType('sender');
    } else {
      setClientType('receiver');
    }
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
      setConnected(false);
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
    send({
      type: 'login',
      name: username,
    });
  };

  const sendPing = () => {
    send({type: 'ping'});
  };

  setInterval(() => {
    if (connected) {
      sendPing();
    }
  }, 25000);

  const updateUsersList = ({user}) => {
    console.log(user.username, typeof user.username);
    setUsers((prev) => [...prev, user]);
    console.log(users);
  };

  const removeUser = ({user}) => {
    setUsers((prev) => prev.filter((u) => u.username !== user.username));
  };

  const onOffer = ({offer, name}) => {
    let sender = {name: name, offer: offer};
    setSenders((prev) => [...prev, sender]);
  };

  const acceptOffer = (name, offer) => {
    setSelectingSender(false);
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
    setConnecting(false);
    connection.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const onCandidate = ({candidate}) => {
    connection.addIceCandidate(new RTCIceCandidate(candidate));
  };

  const onLogin = ({success, message, users: loggedIn}) => {
    if (success) {
      setUsers(loggedIn);
      let localConnection = new RTCPeerConnection(configuration);
      console.log('local connection', localConnection);
      updateConnection(localConnection);
      setConnected(true);
      setSelectingReceiver(true);
      // localConnection.onicecandidate = ({candidate}) => {
      //   let connectedTo = connectedRef.current;
      //   if (candidate && !!connectedTo) {
      //     send({
      //       name: connectedTo,
      //       type: 'candidate',
      //       candidate: candidate,
      //     });
      //   }
      //   localConnection.ondatachannel = (event) => {
      //     console.log('Data channel is created!');
      //     let receiveChannel = event.channel;
      //     receiveChannel.onopen = () => {
      //       console.log('Data channel is open and ready to be used.');
      //     };
      //     receiveChannel.binaryType = 'arraybuffer';
      //     receiveChannel.onmessage = handleDataChannelFileReceived;
      //     updateChannel(receiveChannel);
      //   };
      //};
    } else {
      console.log(message);
      setError(true);
    }
  };

  connection.onicecandidate = ({candidate}) => {
    let connectedTo = connectedRef.current;
    if (candidate && !!connectedTo) {
      send({
        name: connectedTo,
        type: 'candidate',
        candidate: candidate,
      });
    }
    connection.ondatachannel = (event) => {
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
  const handleConnection = (name) => {
    setSelectingReceiver(false);
    setConnecting(true);
    setConnectedTo(name);
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
      .catch((e) => setError(e));
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

  const ReadFile = (file) => {
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

  return (
    <View style={styles.outerContainer}>
      {!connected ? (
        !error ? (
          <WaitingPage desc="Establishing connection" />
        ) : (
          <ErrorPage />
        )
      ) : clientType === 'sender' ? (
        selectingReceiver ? (
          <View>
            <Text style={styles.showingContactsDesc}>
              Showing all available contacts. Tap to connect.
            </Text>
            {users.length !== 0 ? (
              <ScrollView style={{marginLeft: 20}}>
                {users.map((user) => {
                  console.log(user);
                  return (
                    <ContactThumbnail
                      name={user.username}
                      handleConnection={handleConnection}
                      receiver={false}
                    />
                  );
                })}
              </ScrollView>
            ) : (
              <Text>Searching for online users.</Text>
            )}
          </View>
        ) : connecting ? (
          <WaitingPage desc="Waiting for receiver to accept." />
        ) : (
          <Text>Sending Page</Text>
        )
      ) : selectingSender ? (
        senders.length === 0 ? (
          <WaitingPage desc="Waiting for sender." />
        ) : (
          <ReceiveRequests users={senders} acceptOffer={acceptOffer} />
        )
      ) : (
        <Text>Receiving page</Text>
      )}
    </View>
  );
};

export default Connect;
