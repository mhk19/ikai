import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {MenuMainPage} from './mainpage';
import {NavigationContainer} from '@react-navigation/native';
import MainHeader from '../../ikai/components/header';
import {FindPage} from './find';
import {PendingRequests} from './pending';
const MenuStack = createStackNavigator();
export class Menu extends React.Component {
  render() {
    return (
      <NavigationContainer independent={true}>
        <MenuStack.Navigator initialRouteName="main">
          <MenuStack.Screen
            name="main"
            component={MenuMainPage}
            initialParams={{
              logoutHandler: this.props.logoutHandler,
              name: this.props.userDetails.currentUsername,
            }}
            options={{
              header: () => {
                return <MainHeader view={false} />;
              },
            }}></MenuStack.Screen>
          <MenuStack.Screen
            name="Find Friends"
            component={FindPage}
            initialParams={{
              token: this.props.userDetails.token,
            }}></MenuStack.Screen>
          <MenuStack.Screen
            name="Your Requests"
            component={PendingRequests}
            initialParams={{
              token: this.props.userDetails.token,
            }}></MenuStack.Screen>
        </MenuStack.Navigator>
      </NavigationContainer>
    );
  }
}
export default Menu;
