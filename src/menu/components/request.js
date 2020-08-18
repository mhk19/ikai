import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {callAPI} from './find';
import {IKAISERVER} from '../../ikai/constants';
const styles = StyleSheet.create({
  contactContainer: {
    backgroundColor: 'white',
    height: 70,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    margin: '4%',
    alignSelf: 'center',
    borderBottomWidth: 3,
    borderColor: '#D8D8D8',
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
export class Request extends React.Component {
  constructor(props) {
    super(props);
    let image;
    switch (this.props.status) {
      case 'new':
        image = require('../../../assets/images/menu/add.png');
        break;
      case 'pending':
        image = require('../../../assets/images/menu/pending.png');
        break;
      case 'accepted':
        image = require('../../../assets/images/menu/done.png');
        break;
    }
    this.state = {
      status: this.props.status,
      disabled:
        this.props.status === 'pending' || this.props.status === 'accepted',
      image: image,
      name: this.props.name,
    };
  }
  accept(name) {
    callAPI(
      'https://' + IKAISERVER + '/users/accept?user=' + name,
      this.props.token,
    ).then((res) => {
      //after request accepted
      this.setState({
        status: 'accepted',
        disabled: true,
        image: require('../../../assets/images/menu/done.png'),
      });
    });
  }
  decline(name) {
    callAPI(
      'https://' + IKAISERVER + '/users/decline?user=' + name,
      this.props.token,
    ).then((res) => {
      //after request accepted
      this.setState({
        status: 'new',
        disabled: false,
        image: require('../../../assets/images/menu/add.png'),
      });
    });
  }
  request(name) {
    callAPI(
      'https://' + IKAISERVER + '/users/request?user=' + name,
      this.props.token,
    ).then((res) => {
      //after request
      console.log('request sent.');
      this.setState({
        status: 'pending',
        disabled: true,
        image: require('../../../assets/images/menu/pending.png'),
      });
    });
  }
  render() {
    console.log(this.state.status);
    console.log(this.state.disabled);
    return (
      <View style={styles.contactContainer}>
        <Image
          source={require('../../../assets/images/chat/contact_avatar.png')}
          style={{
            width: 40,
            height: 40,
            marginLeft: '1%',
            marginRight: '2%',
          }}></Image>
        <Text style={{fontSize: 15, color: '#000000', width: '60%'}}>
          {this.props.name}
        </Text>
        {this.state.status === 'requested' && (
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => this.accept(this.state.name)}
              style={{marginRight: '10%'}}>
              <Image
                source={require('../../../assets/images/menu/accept.png')}
                style={{width: 20, height: 20, resizeMode: 'center'}}></Image>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.decline(this.state.name)}
              style={{marginRight: '10%'}}>
              <Image
                source={require('../../../assets/images/menu/decline.png')}
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: 'center',
                }}></Image>
            </TouchableOpacity>
          </View>
        )}
        {!(this.state.status === 'requested') && (
          <TouchableOpacity
            disabled={this.state.disabled}
            onPress={() => {
              if (this.state.status === 'new') {
                this.request(this.state.name);
              }
            }}>
            <Image
              source={this.state.image}
              style={{width: 30, height: 30, resizeMode: 'center'}}></Image>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

export default Request;
