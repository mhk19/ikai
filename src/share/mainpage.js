import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ShareMainPage from './sharemainpage';
import ShareMainHeader from './headers';
import ShareOnlineContacts from './online/components/contacts';
import ShareOnlineChatWindow from './online/components/chatwindow';
import ShareOnlineChatHeader from './online/components/chatheader';
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
        <ShareStack.Screen
          name="shareOnlineContacts"
          component={ShareOnlineContacts}
          options={{
            header: (props) => {
              return <ShareMainHeader />;
            },
          }}></ShareStack.Screen>
        <ShareStack.Screen
          name="shareOnlineChatWindow"
          component={ShareOnlineChatWindow}
          options={{
            header: () => {
              return <ShareOnlineChatHeader />;
            },
          }}></ShareStack.Screen>
      </ShareStack.Navigator>
    );
  }
}
export default Share;
