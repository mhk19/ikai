import {View, Text, Button} from 'react-native';
import {Container, Header, Content} from 'native-base';
import ScanbotSDK from 'react-native-scanbot-sdk';
import React from 'react';
import initScanBotSdk from './src/camscanner/init';
// import {ScannerMainPage} from './src/camscanner/components/mainpage';
import {IkaiFooter} from './src/ikai/components/footer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {Scanner} from './src/camscanner/components/mainpage';
import {ChatMainPage} from './src/chat/components/mainpage';
import {navigationRef} from './RootNavigation';
import * as RootNavigation from './RootNavigation.js';

const Tab = createBottomTabNavigator();
const InitialPage = 'scan';
export class App extends React.Component {
  constructor(props) {
    super(props);
    initScanBotSdk().then((r) => console.log(r));
    this.state = {
      page: InitialPage,
    };
  }
  render() {
    return (
      <NavigationContainer ref={navigationRef}>
        <Tab.Navigator
          initialRouteName={InitialPage}
          tabBar={(prop) => <IkaiFooter {...prop} />}
          swipeEnabled={true}>
          <Tab.Screen name="menu" component={Scanner}></Tab.Screen>
          <Tab.Screen name="share" component={Scanner}></Tab.Screen>
          <Tab.Screen name="scan" component={Scanner}></Tab.Screen>
          <Tab.Screen name="chat" component={ChatMainPage}></Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}
export default App;
