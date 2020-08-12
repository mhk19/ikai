import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ShareMainPage from './sharemainpage';
import ShareMainHeader from './headers';

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
          component={ShareMainPage}
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
