import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ShareMainPage from './sharemainpage';
import MainHeader from '../ikai/components/header';
import ActionPage from '../file-transfer/components/action';
import AddFile from '../file-transfer/components/add_file';
import Connect from '../file-transfer/components/connect';
const ShareStack = createStackNavigator();

export class Share extends React.Component {
  constructor(props) {
    super(props);
    this.open = props.route.params.user;
  }

  render() {
    return (
      <ShareStack.Navigator initialRouteName="shareMainscreen">
        <ShareStack.Screen
          name="shareMainscreen"
          component={ShareMainPage}
          options={{
            header: () => {
              return (
                <MainHeader
                  source={require('./assets/share_header.png')}
                  view={true}
                  open={this.open}
                />
              );
            },
          }}></ShareStack.Screen>
        <ShareStack.Screen
          name="shareOnlineActionPage"
          component={ActionPage}
          options={{
            header: () => {
              return (
                <MainHeader
                  source={require('./assets/share_header.png')}
                  view={true}
                  open={this.open}
                />
              );
            },
          }}></ShareStack.Screen>
        <ShareStack.Screen
          name="shareAddFilePage"
          component={AddFile}
          options={{
            header: () => {
              return (
                <MainHeader
                  source={require('./assets/share_header.png')}
                  view={true}
                  open={this.open}
                />
              );
            },
          }}></ShareStack.Screen>
        <ShareStack.Screen
          name="shareConnectPage"
          component={Connect}
          options={{
            header: () => {
              return (
                <MainHeader
                  source={require('./assets/share_header.png')}
                  view={true}
                  open={this.open}
                />
              );
            },
          }}></ShareStack.Screen>
      </ShareStack.Navigator>
    );
  }
}
export default Share;
