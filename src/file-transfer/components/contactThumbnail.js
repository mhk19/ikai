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
});
export class ContactThumbnail extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={styles.contactContainer}
        onPress={() => {
          if (!this.props.receiver) {
            this.props.handleConnection(this.props.name);
          } else {
            this.props.acceptOffer(this.props.name);
          }
        }}>
        <Image
          source={require('../assets/contact_avatar.png')}
          style={{width: 40, height: 40}}
        />
        <View style={styles.contactInfo}>
          <View style={styles.contactName}>
            <Text style={{fontSize: 18, color: '#000000'}}>
              {this.props.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default ContactThumbnail;
