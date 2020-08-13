import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';

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
    padding: '4%',
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
    maxWidth: '45%',
    minHeight: '7%',
    backgroundColor: '#13C2C2',
    alignSelf: 'flex-end',
    borderRadius: 15,
    padding: '3%',
    marginTop: '2%',
  },
  receivedMessage: {
    minWidth: '10%',
    maxWidth: '45%',
    minHeight: '7%',
    marginLeft: 0,
    backgroundColor: '#C4C4C4',
    alignSelf: 'flex-start',
    borderRadius: 15,
    padding: '3%',
    marginTop: '1%',
    marginBottom: '1%',
  },
});
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
export const ShareOnlineChatWindow = (props) => {
  let data = props.route.params;
  const [messages, setMessages] = useState([]);
  const chatroom = data.chatroom_id;
  const [chatSocket, setChatSocket] = useState(null);
  const [typedMessage, setTypedMessage] = useState('');
  const [wbConn, setWbConn] = useState(false);
  useEffect(() => {
    setChatSocket(
      new WebSocket('ws://62876c440dd3.ngrok.io/ws/chat/' + chatroom + '/'),
    );
  }, []);
  useEffect(() => {
    if (!chatSocket) {
      return;
    }
    chatSocket.onopen = function () {
      setWbConn(true);
      fetchPageMessages(1);
      chatSocket.onmessage = function (e) {
        messageReceiveHandler(e);
      };
    };
  });
  const messageReceiveHandler = (e) => {
    const messageData = JSON.parse(e.data);
    if (messageData.messages.length === 0) {
      return;
    }
    try {
      console.log('intial messages');
      console.log(messages);
      for (let i = 0; i < messageData.messages.length; i++) {
        setMessages((messages) => [...messages, messageData.messages[i]]);
      }
      console.log('received messages');
      console.log(...messageData.messages);
      console.log('final message state');
      console.log(messages);
    } catch (e) {
      console.log(e);
    }
  };
  const sendMessage = () => {
    if (wbConn) {
      chatSocket.send(
        JSON.stringify({
          message: typedMessage,
          username: data.username,
          command: 'new_message',
        }),
      );
      setTypedMessage('');
    } else {
      console.log('Websocket connection not made.');
    }
  };

  const fetchPageMessages = (page) => {
    chatSocket.send(
      JSON.stringify({
        page: page,
        command: 'fetch_messages',
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
      <ScrollView style={styles.messages}>
        {wbConn &&
          messages.length > 0 &&
          messages.map((message) => {
            if (message.author === data.username) {
              return <SendMessageBox msg={message.content} />;
            }
            return <ReceiveMessageBox msg={message.content} />;
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
              sendMessage();
            }}>
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
