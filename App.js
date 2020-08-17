import {View, Text, Button, Animated} from 'react-native';
import {Container, Header, Content} from 'native-base';
import ScanbotSDK from 'react-native-scanbot-sdk';
import React, {createContext} from 'react';
import {Colors} from './android/app/model/Colors';
import initScanBotSdk from './src/camscanner/init';
// import {ScannerMainPage} from './src/camscanner/components/mainpage';
import {IkaiFooter} from './src/ikai/components/footer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {Scanner} from './src/camscanner/components/mainpage';
import Chat from './src/chat/mainpage';
import {Share} from './src/share/mainpage';
import {Menu} from './src/menu/components/menumainpage';
import {Editor} from './src/editor/components/mainPage';
import {navigationRef} from './RootNavigation';
import * as RootNavigation from './RootNavigation.js';
import Drawer from 'react-native-drawer';
<<<<<<< HEAD
import Home from './src/offShare/components/test';
=======
import {Offline} from './src/share/offline/offlinemainpage';
>>>>>>> 138cc7b2faa641a3aa65fcf89a283d5200db5ee5
const Tab = createBottomTabNavigator();
const InitialPage = 'share';
export class App extends React.Component {
  constructor(props) {
    super(props);
    initScanBotSdk().then((r) => console.log(r));
  }
  closeControlPanel = () => {
    this._drawer.close();
  };
  openControlPanel = () => {
    this._drawer.open();
  };
  render() {
    return (
<<<<<<< HEAD
      <View>
        <Home/>
      </View>
      // <Drawer
      //   ref={(ref) => (this._drawer = ref)}
      //   content={<Menu />}
      //   type="overlay"
      //   openDrawerOffset={150}
      //   disabled={false}
      //   side="left">
      //   <NavigationContainer ref={navigationRef}>
      //     <Tab.Navigator
      //       initialRouteName={InitialPage}
      //       tabBar={(prop) => <IkaiFooter {...prop} />}>
      //       {/* <Tab.Screen name="menu" component={MenuMainPage}></Tab.Screen> */}
      //       <Tab.Screen
      //         name="share"
      //         component={Share}
      //         initialParams={{user: this.openControlPanel}}></Tab.Screen>
      //       <Tab.Screen
      //         name="scan"
      //         component={Scanner}
      //         initialParams={{user: this.openControlPanel}}></Tab.Screen>
      //       <Tab.Screen
      //         name="chat"
      //         component={Chat}
      //         initialParams={{user: this.openControlPanel}}></Tab.Screen>
      //     </Tab.Navigator>
      //   </NavigationContainer>
      // </Drawer>
=======
      <Drawer
        ref={(ref) => (this._drawer = ref)}
        content={<Menu />}
        type="overlay"
        openDrawerOffset={100}
        disabled={false}
        side="left">
        <NavigationContainer ref={navigationRef}>
          <Tab.Navigator
            initialRouteName={InitialPage}
            tabBar={(prop) => <IkaiFooter {...prop} />}>
            {/* <Tab.Screen name="menu" component={MenuMainPage}></Tab.Screen> */}
            <Tab.Screen
              name="share"
              component={Share}
              initialParams={{user: this.openControlPanel}}></Tab.Screen>
            <Tab.Screen
              name="edit"
              component={Editor}
              initialParams={{user: this.openControlPanel}}></Tab.Screen>
            <Tab.Screen
              name="scan"
              component={Scanner}
              initialParams={{user: this.openControlPanel}}></Tab.Screen>
            <Tab.Screen
              name="chat"
              component={Chat}
              initialParams={{user: this.openControlPanel}}></Tab.Screen>
          </Tab.Navigator>
        </NavigationContainer>
      </Drawer>
>>>>>>> 138cc7b2faa641a3aa65fcf89a283d5200db5ee5
    );
  }
}

export default App;
