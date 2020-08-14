import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ShareMainPage from './sharemainpage';
import MainHeader from '../ikai/components/header';
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
      </ShareStack.Navigator>
    );
  }
}
export default Share;
