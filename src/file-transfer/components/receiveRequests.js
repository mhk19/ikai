import React from 'react';
import {View, Image, Text, ScrollView, StyleSheet} from 'react-native';
import ContactThumbnail from './contactThumbnail';

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    marginTop: 25,
    resizeMode: 'contain',
  },
  descContainer: {
    marginTop: 10,
    color: '#979797',
    fontFamily: 'roboto',
    fontStyle: 'normal',
    fontSize: 16,
  },
});

export class ReceiveRequests extends React.Component {
  render() {
    return (
      <View style={styles.outerContainer}>
        <Image
          style={styles.imageContainer}
          source={require('../../../assets/images/file-transfer/network.png')}
        />
        <Text style={styles.descContainer}>
          Please tap to accept connection request and continue.
        </Text>
        <ScrollView style={{marginTop: 10}}>
          {this.props.users.map((user) => {
            return (
              <ContactThumbnail
                name={user}
                receiver={true}
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
