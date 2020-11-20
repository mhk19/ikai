import React, {useState, useEffect, useRef} from 'react';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
} from 'react-native-webrtc';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import ContactThumbnail from './contactThumbnail';
import ReceiveRequests from './receiveRequests';
import WaitingPage from './waiting';
import ErrorPage from './errorPage';
import SendFilePage from './send_file';
import {EatBeanLoader} from 'react-native-indicator';

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
  descContainer2: {
    fontFamily: 'roboto',
    fontStyle: 'normal',
    fontSize: 20,
    flexDirection: 'row',
    textAlign: 'center',
    color: '#13C2C2',
  },
  iconContainer: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D9D9D9',
    borderRadius: 2,
    alignItems: 'center',
    flex: 0.2,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  fileContainer: {
    flexDirection: 'row',
    width: 300,
    height: 70,
    marginTop: 20,
    justifyContent: 'center',
  },
  filenameContainer: {
    flex: 0.7,
    fontFamily: 'roboto',
    fontStyle: 'normal',
    fontSize: 14,
    borderStyle: 'solid',
    borderColor: '#D9D9D9',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImgContainer: {
    // marginTop: 10,
    resizeMode: 'contain',
    height: 35,
  },
});

const MAXIMUM_MESSAGE_SIZE = 65535;
const END_OF_FILE_MESSAGE = 'EOF';
let fileName = '';
const configuration = {
  iceServers: [
    {url: 'stun:stun.1.google.com:19302'},
    {url: 'stun1.l.google.com:19302'},
    {url: 'stun2.l.google.com:19302'},
    {url: 'stun3.l.google.com:19302'},
    {url: 'stun4.l.google.com:19302'},
    {url: 'stun01.sipphone.com'},
    {url: 'stun.ekiga.net'},
    {url: 'stun.fwdnet.net'},
    {url: 'stun.ideasip.com'},
    {url: 'stun.ideasip.com'},
    {url: 'stun.iptel.org'},
    {url: 'stun.rixtelecom.se'},
    {url: 'stun.schlund.de'},
    {url: 'stunserver.org'},
    {url: 'stun.softjoys.com'},
    {url: 'stun.voiparound.com'},
    {url: 'stun.voipbuster.com'},
    {url: 'stun.voipstunt.com'},
    {url: 'stun.voxgratia.org'},
    {url: 'stun.xten.com'},
  ],
};
export const Connect = (props) => {
  console.log(props.route.params);
  const [socketMessages, setSocketMessages] = useState([]);
  const [username, setUserName] = useState(props.route.params.username);
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
  const [sent, setSent] = useState(false);
  const [receive, setReceive] = useState(false);
  const connectedRef = useRef();
  let receivedBuffers = [];

  useEffect(() => {
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
        case 'request':
          onRequest(data);
          break;
        case 'accept':
          onAccept(data);
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

  const request = (name) => {
    setSelectingReceiver(false);
    setConnecting(true);
    send({
      type: 'request',
      name: name,
    });
  };

  const accept = (name) => {
    setSelectingSender(false);
    send({
      type: 'accept',
      name: name,
    });
  };

  const onRequest = ({name}) => {
    setSenders((prev) => [...prev, name]);
  };

  const onAccept = ({name}) => {
    setConnecting(false);
    handleConnection(name);
  };

  const updateUsersList = ({user}) => {
    console.log(user.username, typeof user.username);
    setUsers((prev) => [...prev, user]);
    console.log(users);
  };

  const removeUser = ({user}) => {
    setUsers((prev) => prev.filter((u) => u.username !== user.username));
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

  const onLogin = ({success, message, users: loggedIn}) => {
    if (success) {
      setUsers(loggedIn);
      let localConnection = new RTCPeerConnection(configuration);
      console.log('local connection', localConnection);
      updateConnection(localConnection);
      setConnected(true);
      setSelectingReceiver(true);
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
            // updateChannel(receiveChannel);
            receiveChannel.send('ikaiopen');
            console.log('Data channel is open and ready to be used.');
            receiveChannel.onmessage = ({data}) => {
              handleDataChannelFileReceived(data);
            };
            // receiveChannel.onmessage = handleDataChannelFileReceived;
          };
          receiveChannel.binaryType = 'arraybuffer';
          // receiveChannel.onmessage = handleDataChannelFileReceived;
          updateChannel(receiveChannel);
        };
      };
    } else {
      console.log(message);
      setError(true);
    }
  };

  const handleConnection = (name) => {
    setConnectedTo(name);
    let dataChannel = connection.createDataChannel('file');
    console.log('datachannels');
    console.log(dataChannel);

    dataChannel.onerror = (error) => {
      console.log('datachannel error');
      console.log(error);
    };
    dataChannel.binaryType = 'arraybuffer';
    dataChannel.onmessage = ({data}) => {
      console.log(data);
      if (data === 'ikaiopen') {
        // dataChannel.send(JSON.stringify(props.route.params.file));
        // dataChannel.send('SOF');
        console.log('starting to call readfile');
        console.log('here channel is', dataChannel);
        updateChannel(dataChannel);
        ReadFile(props.route.params.file, dataChannel);
      }
      handleDataChannelFileReceived(data);
    };
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

  const handleDataChannelFileReceived = (data) => {
    console.log(data);
    try {
      if (data !== END_OF_FILE_MESSAGE) {
        if (fileName === '') {
          fileName = data;
          console.log('filename is', fileName);
        } else {
          receivedBuffers.push(data);
        }
      } else if (data === END_OF_FILE_MESSAGE) {
        RNFetchBlob.fs
          .writeStream(
            RNFetchBlob.fs.dirs.DownloadDir + '/' + fileName,
            'base64',
          )
          .then((stream) => {
            for (let i = 0; i < receivedBuffers.length; i++) {
              stream.write(receivedBuffers[i]);
            }
            console.log(receivedBuffers);
            console.log('File completely received');
            setReceive(true);
            fileName = '';
            receivedBuffers = [];
            return stream.close();
          });
      } else {
        console.log('file cannot be received completely');
      }
    } catch (err) {
      console.log(err);
      console.log('File transfer failed');
    }
  };

  const ReadFile = (file, datachannel) => {
    const realPath = file.path;
    if (realPath !== null) {
      console.log('path is', realPath);
      datachannel.send(file.fileName);
      RNFetchBlob.fs
        .readStream(realPath, 'base64', MAXIMUM_MESSAGE_SIZE)
        .then((ifstream) => {
          ifstream.open();
          ifstream.onData((chunk) => {
            console.log('reading file');
            console.log('channel', channel);
            datachannel.send(chunk);
          });
          ifstream.onError((err) => {
            console.log('error in reading file', err);
          });
          ifstream.onEnd(() => {
            datachannel.send(END_OF_FILE_MESSAGE);
            console.log('read successful');
            setSent(true);
            fileName = '';
            setRece;
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
                      handleConnection={request}
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
          <SendingPage sent={sent}></SendingPage>
        )
      ) : selectingSender ? (
        senders.length === 0 ? (
          <WaitingPage desc="Waiting for sender." />
        ) : (
          <ReceiveRequests users={senders} acceptOffer={accept} />
        )
      ) : (
        <ReceivingPage
          receive={receive}
          desc={'Receiving your file, hold tight'}></ReceivingPage>
      )}
    </View>
  );
};

const SendingPage = (props) => {
  return (
    <View>
      {!props.sent && <WaitingPage desc={'Sending file ...'} />}
      {props.sent && (
        <View style={{alignItems: 'center'}}>
          <Image
            style={styles.imageContainer}
            source={require('../../../assets/images/file-transfer/sentfile.png')}
          />
          <Text style={styles.descContainer2}>File successfully sent!</Text>
        </View>
      )}
    </View>
  );
};

const ReceivingPage = (props) => {
  if (!props.receive) {
    return (
      <View style={styles.innerContainer}>
        <Image
          style={styles.imageContainer}
          source={require('../../../assets/images/file-transfer/files.png')}
        />
        <Text
          style={{
            color: '#979797',
            fontFamily: 'roboto',
            fontStyle: 'normal',
            fontSize: 20,
            marginBottom: '15%',
          }}>
          {props.desc}
        </Text>
        <EatBeanLoader color={'#13C2C2'} size={40}></EatBeanLoader>
      </View>
    );
  } else {
    return (
      <View>
        <View style={{alignItems: 'center'}}>
          <Image
            style={styles.imageContainer}
            source={require('../../../assets/images/file-transfer/files.png')}
          />
          <Text style={styles.descContainer2}>File successfully received!</Text>
          <Text style={styles.descContainer2}>Check your Downloads folder</Text>
        </View>
        <View style={styles.fileContainer}>
          <View style={styles.iconContainer}>
            <Image
              source={require('../../../assets/images/file-transfer/file_icon.png')}
              style={styles.iconImgContainer}
            />
            <Text style={{color: '#979797'}}>FILE</Text>
          </View>
          <View style={styles.filenameContainer}>
            <Text style={{color: '#979797'}}>{fileName}</Text>
          </View>
        </View>
      </View>
    );
  }
};

export default Connect;
