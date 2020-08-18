import React, { useState, useEffect, useReducer } from 'react';
import { View, StyleSheet, ScrollView, Text, Image } from 'react-native';
import Request from './request';
import axios from 'axios';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { IKAISERVER } from '../../ikai/constants';
import { BreathingLoader } from 'react-native-indicator';
import Toast from 'react-native-simple-toast';
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
export const callAPI = (url, token, setLoading) => {
  if (setLoading) {
    setLoading(true);
  }
  return new Promise((resolve, reject) => {
    axios
      .get(url, { headers: { Authorization: `Token ${token}` } })
      .then(
        (res) => {
        console.log(res.data);
        if (res.status !== 200) {
          if (setLoading) {
            setLoading(false);
          }
          Toast.show('Error Received with status code: ' + res.status);
          return;
        } else {
          resolve(res.data);
        }
        (error) => { 
          console.log(error); 
          if (setLoading) {
            setLoading(false);
          }
          Toast.show('Error Received with status code: ' + res.status);
          return;
        }
      })
      .catch((err) => 
      errorHandle(err)
      );

    async function errorHandle(error) {
      console.log(error);
        if (setLoading) {
          setLoading(false);
        }
        Toast.show('Check your internet connection and try again');
        return;
      }
  });
};

export const FindPage = (props) => {
  const [username, setUsername] = useState('burnerlee');
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [userLoggedin, setUserLoggedin] = useState(true);
  const [dataReceived, setDataReceived] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const searchUsers = () => {
    if (query === '') {
      return;
    }
    console.log;
    callAPI(
      'http://' + IKAISERVER + '/users/search?query=' + query,
      props.route.params.token,
      setLoading,
    ).then((res) => {
      setSearchedUsers(res.users);
      setLoading(false);
    });
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
            style={{ width: 30, height: 30, resizeMode: 'center' }}></Image>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.innerContainer}
        showsVerticalScrollIndicator={false}>
        {isLoading && (
          <View
            style={{
              alignContent: 'center',
              alignSelf: 'center',
            }}>
            <BreathingLoader
              color={'#13C2C2'}
              size={40}
              strokeWidth={8}
              frequency={800}></BreathingLoader>
          </View>
        )}
        {searchedUsers.map((user) => {
          return (
            <Request
              name={user.username}
              status={user.status}
              token={props.route.params.token}
              setLoading={setLoading}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default FindPage;
