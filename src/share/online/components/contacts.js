import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, Text} from 'react-native';
import ContactThumbnail from './contactThumbnail';
import axios from 'axios';
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
  const [userLoggedin, setUserLoggedin] = useState(true);
  const [dataReceived, setDataReceived] = useState(false);
  useEffect(() => {
    callAPI('http://23832adb5a50.ngrok.io/users/chatrooms').then((res) => {
      setDataReceived(true);
      setChatrooms(res.results);
    });
  }, []);
  if (userLoggedin) {
    if (dataReceived) {
      if (chatrooms.length === 0) {
        return (
          <View style={styles.outerContainer}>
            <Text>ADD SOME PEOPLE YOU BORING!</Text>
          </View>
        );
      }
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
                  chatroom_id={chatroom.id}
                  navigation={props.navigation}
                />
              );
            })}
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View>
          <Text>Loading</Text>
        </View>
      );
    }
  }
};

export default ShareOnlineContacts;
