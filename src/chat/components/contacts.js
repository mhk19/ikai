import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, Text} from 'react-native';
import ContactThumbnail from './contactThumbnail';
import axios from 'axios';
import {IKAISERVER} from '../../ikai/constants';
import {ErrorPage} from '../../file-transfer/components/errorPage';
import {WaitingPage} from '../../file-transfer/components/waiting';
const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'stretch',
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
});
const callAPI = (url) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
};

export const ShareOnlineContacts = (props) => {
  const [username, setUsername] = useState('burnerlee');
  const [chatrooms, setChatrooms] = useState([]);
  const [dataReceived, setDataReceived] = useState(false);
  const [connectError, setConnectError] = useState(false);
  const refreshFunction = async () => {
    await callAPI('http://' + IKAISERVER + '/users/chatrooms')
      .then((res) => {
        console.log('Data is received.');
        setConnectError(false);
        setDataReceived(true);
        setChatrooms(res.results);
      })
      .catch((err) => {
        setConnectError(true);
        console.log(err);
      });
  };
  useEffect(() => {
    callAPI('http://' + IKAISERVER + '/users/chatrooms')
      .then((res) => {
        console.log('Data is received.');
        setDataReceived(true);
        setChatrooms(res.results);
      })
      .catch((err) => {
        setConnectError(true);
        console.log(err);
      });
  }, []);
  if (connectError) {
    return <ErrorPage refreshFunction={refreshFunction}></ErrorPage>;
  }
  if (dataReceived) {
    // if (chatrooms.length === 0) {
    //   return (
    //     <View style={styles.outerContainer}>
    //       <Text>ADD SOME PEOPLE YOU BORING!</Text>
    //     </View>
    //   );
    // }
    return (
      <View style={styles.outerContainer}>
        <ScrollView
          style={styles.innerContainer}
          showsVerticalScrollIndicator={false}>
          {chatrooms.map((chatroom) => {
            let member_names = chatroom.name.split('-');
            let contactName;
            if (member_names[0] === username) {
              contactName = member_names[1];
            } else {
              contactName = member_names[0];
            }
            return (
              <ContactThumbnail
                name={contactName}
                time={chatroom.updated_at}
                date={chatroom.updated_at_date}
                last={chatroom.last_message}
                chatroom_id={chatroom.id}
                navigation={props.navigation}
                username={username}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  } else {
    return <WaitingPage desc={'Fetching Your Chats, Hang Tight'} />;
  }
};

export default ShareOnlineContacts;
