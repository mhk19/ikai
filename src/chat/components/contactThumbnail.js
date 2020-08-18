import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';

const styles = StyleSheet.create({
  contactContainer: {
    backgroundColor: 'white',
    width: '100%',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactInfo: {
    width: '65%',
    marginLeft: '5%',
    height: '100%',
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: 2,
  },
  time: {
    width: '20%',
    height: '100%',
    backgroundColor: 'white',
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: 2,
    paddingTop: '3%',
    flexDirection: 'column',
  },
});
export class ContactThumbnail extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={styles.contactContainer}
        onPress={() => {
          this.props.navigation.push('shareOnlineChatWindow', {
            username: this.props.username,
            chatname: this.props.name,
            chatroom_id: this.props.chatroom_id,
            publickey: this.props.publickey,
            my_publickey: this.props.my_publickey,
            privatekey: this.props.privatekey,
            token: this.props.token,
          });
        }}>
        <Image
          source={require('../assets/contact_avatar.png')}
          style={{width: 40, height: 40}}></Image>
        <View style={styles.contactInfo}>
          <View style={styles.contactName}>
            <Text style={{fontSize: 18, color: '#000000'}}>
              {this.props.name}
            </Text>
          </View>
        </View>
        <View style={styles.time}>
          <Text style={{fontSize: 13, color: '#979797'}}>
            {this.props.time}
          </Text>
          <Text style={{fontSize: 13, color: '#979797'}}>
            {this.props.date}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default ContactThumbnail;
