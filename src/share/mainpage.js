import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ShareMainPage from './sharemainpage';
import ShareMainHeader from './headers';
import {Connection} from '../file-transfer/components/connection';

const ShareStack = createStackNavigator();

export class Share extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ShareStack.Navigator initialRouteName="shareMainscreen">
        <ShareStack.Screen
          name="shareMainscreen"
          component={Connection}
          options={{
            header: () => {
              return <ShareMainHeader />;
            },
          }}></ShareStack.Screen>
      </ShareStack.Navigator>
    );
  }
}
export default Share;
