import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MainHeader from '../ikai/components/header';
import ShareOnlineContacts from './components/contacts';
import ShareOnlineChatWindow from './components/chatwindow';
const ChatStack = createStackNavigator();

export class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.open = props.route.params.user;
  }

  render() {
    return (
      <ChatStack.Navigator initialRouteName="shareOnlineContacts">
        <ChatStack.Screen
          name="shareOnlineContacts"
          component={ShareOnlineContacts}
          initialParams={{userDetails: this.props.route.params.userDetails}}
          options={{
            header: (props) => {
              return (
                <MainHeader
                  source={require('../../assets/images/chat/chat_header.png')}
                  view={true}
                  open={this.open}
                />
              );
            },
          }}></ChatStack.Screen>
        <ChatStack.Screen
          name="shareOnlineChatWindow"
          component={ShareOnlineChatWindow}
          initialParams={{userDetails: this.props.route.params.userDetails}}
          options={{
            header: () => {
              return <MainHeader view={false} />;
            },
          }}></ChatStack.Screen>
      </ChatStack.Navigator>
    );
  }
}
export default Chat;
