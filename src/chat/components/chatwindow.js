import React, {useState, useEffect, useRef} from 'react';
import {IKAISERVER} from '../../ikai/constants';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import {RSA} from 'react-native-rsa-native';

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  header: {
    width: '100%',
    height: 70,
    backgroundColor: '#13C2C2',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    minHeight: '95%',
    maxHeight: '95%',
    width: '84%',
    marginLeft: '8%',
    marginTop: '8%',
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  messages: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  send: {
    minHeight: '6%',
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textinput: {
    height: '85%',
    width: '80%',
    marginTop: 5,
    backgroundColor: 'white',
    marginLeft: '3%',
    marginRight: '3%',
    borderRadius: 20,
    elevation: 1,
    borderColor: '#C4C4C4',
    borderWidth: 1,
    padding: '1%',
  },
  sentMessage: {
    minWidth: '10%',
    maxWidth: '60%',
    backgroundColor: '#13C2C2',
    alignSelf: 'flex-end',
    borderRadius: 15,
    padding: '3%',
    marginTop: '2%',
    marginRight: '2%',
  },
  receivedMessage: {
    minWidth: '10%',
    maxWidth: '60%',
    marginLeft: 0,
    backgroundColor: '#C4C4C4',
    alignSelf: 'flex-start',
    borderRadius: 15,
    padding: '3%',
    marginTop: '1%',
    marginLeft: '2%',
  },
});
export const ShareOnlineChatWindow = (props) => {
  let message = 'my secret message';
  RSA.generateKeys(4096) // set key size
    .then((keys) => {
      console.log('4096 private:', keys.private); // the private key
      console.log('4096 public:', keys.public); // the public key
      RSA.encrypt(message, keys.public).then((encodedMessage) => {
        console.log(`the encoded message is ${encodedMessage}`);
        RSA.decrypt(encodedMessage, keys.private).then((decryptedMessage) => {
          console.log(`The original message was ${decryptedMessage}`);
        });
      });
    });
  let data = props.route.params;
  const [privatekey] = useState(data.privatekey);
  const [publickey] = useState(data.publicKey);
  const my_publickey = useState(data.my_publickey);
  // RSA.encrypt('hello', publickey).then((encodedMessage) => {
  //   console.log(`the encoded message is ${encodedMessage}`);
  // });
  const token = data.token;
  const scroller = useRef();
  const [messages, setMessages] = useState([]);
  const chatroom = data.chatroom_id;
  const [chatSocket, setChatSocket] = useState(null);
  const [typedMessage, setTypedMessage] = useState('');
  const [wbConn, setWbConn] = useState(false);
  const [prevButton, setPrevButton] = useState(true);
  useEffect(() => {
    setChatSocket(
      new WebSocket('ws://' + IKAISERVER + '/ws/chat/' + chatroom + '/'),
    );
  }, []);
  useEffect(() => {
    if (!chatSocket) {
      return;
    }
    chatSocket.onopen = function () {
      console.log(props);
      setWbConn(true);
      setMessages([]);
      fetchPageMessages();
      chatSocket.onmessage = function (e) {
        messageReceiveHandler(e);
      };
    };
  });
  const messageReceiveHandler = (e) => {
    if (JSON.parse(e.data).err) {
      console.log(e);
      return;
    }
    const messageData = JSON.parse(e.data);
    if (messageData.messages.length === 0) {
      return;
    }
    try {
      console.log(messageData.messages);
      if (messageData.typ == 'new') {
        for (let i = 0; i < messageData.messages.length; i++) {
          setMessages((messages) => [...messages, messageData.messages[i]]);
        }
      } else if (messageData.typ == 'old') {
        for (let i = 0; i < messageData.messages.length; i++) {
          setMessages((messages) => [messageData.messages[i], ...messages]);
        }
      }
      Keyboard.dismiss();
      setTypedMessage('');
    } catch (e) {
      console.log(e);
    }
  };
  const SendMessageBox = (props) => {
    return (
      <View style={styles.sentMessage}>
        <Text style={{color: 'white', fontSize: 17}}>{props.msg}</Text>
      </View>
    );
  };
  const ReceiveMessageBox = (props) => {
    return (
      <View style={styles.receivedMessage}>
        <Text style={{color: 'black', fontSize: 17}}>{props.msg}</Text>
      </View>
    );
  };
  const sendMessage = () => {
    if (wbConn) {
      chatSocket.send(
        JSON.stringify({
          message: data.message,
          username: data.chatname,
          command: 'new_message',
          token: token,
        }),
      );
    } else {
      console.log('Websocket connection not made.');
    }
  };

  const fetchPageMessages = () => {
    chatSocket.send(
      JSON.stringify({
        command: 'fetch_messages',
        token: token,
      }),
    );
  };
  const fetchPreviousMessages = () => {
    chatSocket.send(
      JSON.stringify({
        command: 'fetch_prev_messages',
        token: token,
        time: messages[0].timestamp,
      }),
    );
  };

  return (
    <KeyboardAvoidingView style={styles.outerContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{margin: '5%'}}
          onPress={() => {
            props.navigation.pop();
          }}>
          <Image
            source={require('../assets/back.png')}
            style={{height: 30, width: 30}}></Image>
        </TouchableOpacity>
        <Image
          source={require('../assets/contact_avatar.png')}
          style={{width: 40, height: 40, marginRight: '10%'}}></Image>
        <Text style={{color: 'white', fontSize: 25}}>{data.chatname}</Text>
      </View>
      <ScrollView
        style={styles.messages}
        ref={scroller}
        onContentSizeChange={() => {
          setPrevButton(true);
        }}>
        {wbConn && prevButton && messages.length > 0 && (
          <TouchableOpacity
            style={{
              alignSelf: 'center',
              width: 100,
              height: 40,
              backgroundColor: '#13C2C2',
              borderRadius: 20,
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: 'white',
            }}
            onPress={() => {
              setPrevButton(false);
              fetchPreviousMessages();
            }}>
            <Text
              style={{
                textAlign: 'center',
                textAlignVertical: 'center',
                color: 'white',
                fontSize: 10,
              }}>
              Fetch Previous Messages
            </Text>
          </TouchableOpacity>
        )}
        {wbConn &&
          messages.length > 0 &&
          messages.map((message) => {
            if (message.author === data.username) {
              return <SendMessageBox msg={message.content} typ={message.typ} />;
            }
            return (
              <ReceiveMessageBox
                msg={virgilCrypto
                  .decrypt(message.content, privatekey)
                  .toString('utf-8')}
                typ={message.typ}
              />
            );
          })}
        {!wbConn && (
          <View
            style={{
              alignSelf: 'center',
              width: 100,
              height: 50,
              backgroundColor: '#13C2C2',
              borderRadius: 20,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                textAlign: 'center',
                textAlignVertical: 'center',
                color: 'white',
                fontSize: 18,
              }}>
              Loading...
            </Text>
          </View>
        )}
      </ScrollView>
      {wbConn && (
        <View style={styles.send}>
          <TextInput
            style={styles.textinput}
            multiline={true}
            onChange={(e) => setTypedMessage(e.nativeEvent.text)}
            value={typedMessage}></TextInput>
          <TouchableOpacity
            onPress={() => {
              setTypedMessage('');
              sendMessage();
            }}
            disabled={typedMessage === ''}>
            <Image
              source={require('../assets/send.png')}
              style={{height: 40, width: 40}}></Image>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default ShareOnlineChatWindow;
