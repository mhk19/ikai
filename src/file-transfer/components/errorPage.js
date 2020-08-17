import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  imageContainer: {
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
});

export class ErrorPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
    console.log(props);
  }
  render() {
    return (
      <ScrollView
        contentContainerStyle={{minWidth: '100%', minHeight: '100%'}}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={() => {
              this.setState({refreshing: true});
              this.props.refreshFunction().then(() => {
                this.setState({refreshing: false});
              });
            }}></RefreshControl>
        }>
        <View style={styles.innerContainer}>
          <Image
            style={styles.imageContainer}
            source={require('../assets/networkfail.png')}
          />
          <Text
            style={{
              color: '#FF0000',
              fontFamily: 'roboto',
              fontStyle: 'normal',
              fontSize: 16,
              textAlign: 'center',
            }}>
            Failed. Please check your internet connection and try again.
          </Text>
        </View>
      </ScrollView>
    );
  }
}

export default ErrorPage;
