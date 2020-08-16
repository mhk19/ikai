import React, {useState, useEffect, useReducer} from 'react';
import {View, StyleSheet, ScrollView, Text, Image} from 'react-native';
import Request from './request';
import axios from 'axios';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
const styles = StyleSheet.create({
  outerContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
    borderRightColor: '#595959',
    borderRightWidth: 3,
    borderRadius: 15,
  },
  innerContainer: {
    minWidth: '95%',
    maxWidth: '95%',
    marginTop: '10%',
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  searchbar: {
    height: 50,
    width: '95%',
    marginTop: '15%',
    backgroundColor: 'white',
    alignItems: 'center',
    borderWidth: 2,
    flexDirection: 'row',
    borderRadius: 20,
    elevation: 2,
    borderColor: '#C4C4C4',
    borderWidth: 1,
  },
  textinput: {
    height: 40,
    width: '80%',
    backgroundColor: 'white',
    marginRight: '3%',
    borderRadius: 20,
    marginLeft: '3%',
    padding: '1%',
    textAlignVertical: 'center',
    textAlign: 'center',
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

export const FindPage = (props) => {
  const [username, setUsername] = useState('burnerlee');
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [userLoggedin, setUserLoggedin] = useState(true);
  const [dataReceived, setDataReceived] = useState(false);
  const [query, setQuery] = useState('');
  const searchUsers = () => {
    if (query === '') {
      return;
    }
    console.log;
    callAPI('http://346e890af303.ngrok.io/users/search?query=' + query).then(
      (res) => {
        setSearchedUsers(res.users);
      },
    );
  };
  return (
    <View style={styles.outerContainer}>
      <View style={styles.searchbar}>
        <TextInput
          style={styles.textinput}
          placeholder={'Search for a user'}
          onChange={(e) => {
            setQuery(e.nativeEvent.text);
          }}
          onSubmitEditing={searchUsers}></TextInput>
        <TouchableOpacity onPress={searchUsers}>
          <Image
            source={require('../assets/search.png')}
            style={{width: 30, height: 30, resizeMode: 'center'}}></Image>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.innerContainer}
        showsVerticalScrollIndicator={false}>
        {searchedUsers.map((user) => {
          return <Request name={user.username} status={user.status} />;
        })}
      </ScrollView>
    </View>
  );
};

export default FindPage;
