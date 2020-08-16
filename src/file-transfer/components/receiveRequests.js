import React from 'react';
import {View, Image, Text, ScrollView} from 'native-base';
import ContactThumbnail from './contactThumbnail';

export class ReceiveRequests extends React.Component {
  render() {
    return (
      <View>
        <Image source={require('../assets/network.png')} />
        <Text>Please tap to accept connection request and continue.</Text>
        <ScrollView>
          {this.props.users.map((user) => {
            return (
              <ContactThumbnail
                name={user.name}
                receiver={true}
                offer={user.offer}
                acceptOffer={this.props.acceptOffer}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

export default ReceiveRequests;
