import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ShareMainPage from './sharemainpage';
import MainHeader from '../ikai/components/header';
import {OfflineMainPage} from './offline/mainpage';
import {HotspotDetails} from './offline/components/hotspotdetails';
import {AvailableWifi} from './offline/components/availablewifi';
import {SendPage} from './offline/components/sendpage';
import {ReceiveFileOffline} from './offline/components/receiveFile';
import {ActionPage} from '../file-transfer/components/action';
import {AddFile} from '../file-transfer/components/add_file';
import {Connect} from '../file-transfer/components/connect';
const ShareStack = createStackNavigator();

export class Share extends React.Component {
  constructor(props) {
    super(props);
    this.open = props.route.params.user;
    this.username = props.route.params.userDetails.currentUsername;
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
          name="offlinemainscreen"
          component={OfflineMainPage}
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
                  open={false}
                />
              );
            },
          }}
        />
        <ShareStack.Screen
          name="hotspotdetails"
          component={HotspotDetails}
          options={{
            header: () => {
              return (
                <MainHeader
                  source={require('./assets/share_header.png')}
                  view={true}
                  open={false}
                />
              );
            },
          }}
        />
        <ShareStack.Screen
          name="shareConnectPage"
          component={Connect}
          initialParams={{username: this.username}}
          open={{
            header: () => {
              return (
                <MainHeader
                  source={require('./assets/share_header.png')}
                  view={true}
                  open={false}
                />
              );
            },
          }}
        />
        <ShareStack.Screen
          name="availablewifi"
          component={AvailableWifi}
          options={{
            header: () => {
              return (
                <MainHeader
                  source={require('./assets/share_header.png')}
                  view={true}
                  open={false}
                />
              );
            },
          }}
        />
        <ShareStack.Screen
          name="sendpage"
          component={SendPage}
          options={{
            header: () => {
              return (
                <MainHeader
                  source={require('./assets/share_header.png')}
                  view={true}
                  open={false}
                />
              );
            },
          }}
        />
        <ShareStack.Screen
          name="receiveFile"
          component={ReceiveFileOffline}
          options={{
            header: () => {
              return (
                <MainHeader
                  source={require('./assets/share_header.png')}
                  view={true}
                  open={false}
                />
              );
            },
          }}
        />
      </ShareStack.Navigator>
    );
  }
}
export default Share;
