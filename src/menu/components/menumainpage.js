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
            options={{
              header: () => {
                return <MainHeader view={false} />;
              },
            }}></MenuStack.Screen>
          <MenuStack.Screen
            name="Find Friends"
            component={FindPage}></MenuStack.Screen>
          <MenuStack.Screen
            name="Your Requests"
            component={PendingRequests}></MenuStack.Screen>
        </MenuStack.Navigator>
      </NavigationContainer>
    );
  }
}
export default Menu;
