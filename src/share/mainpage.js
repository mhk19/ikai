import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ShareMainPage from './sharemainpage';
import MainHeader from '../ikai/components/header';
import {OfflineMainPage} from './offline/mainpage';
import {HotspotDetails} from './offline/components/hotspotdetails';
import {AvailableWifi} from './offline/components/availablewifi';
import {SendPage} from './offline/components/sendpage';
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
          name="offlinemainscreen"
          component={OfflineMainPage}
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
      </ShareStack.Navigator>
    );
  }
}
export default Share;
