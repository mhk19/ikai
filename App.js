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
import {LoginComponent} from './src/user/components/login';
import {RegisterComponent} from './src/user/components/register';
import * as RootNavigation from './RootNavigation.js';
import Drawer from 'react-native-drawer';
import AsyncStorage from '@react-native-community/async-storage';
const Tab = createBottomTabNavigator();
const InitialPage = 'share';

export class App extends React.Component {
  constructor(props) {
    super(props);
    initScanBotSdk().then((r) => console.log(r));
    this.getToken();
    this.state = {
      user: null,
      token: null,
      isLogin: false,
      page: 'login',
    };
    this.loginHandler = this.loginHandler.bind(this);
    this.pageHandler = this.pageHandler.bind(this);
  }
  closeControlPanel = () => {
    this._drawer.close();
  };
  openControlPanel = () => {
    this._drawer.open();
  };
  loginHandler() {
    console.log('user is logged in');
    this.setState({isLogin: true});
  }
  pageHandler(page) {
    this.setState({page: page});
  }
  getToken() {
    try {
      this.getMyStringValue('username');
      this.getMyStringValue('token');
    } catch {
      console.log('unable to read from storage');
    }
  }

  getUser = async () => {
    await AsyncStorage.getItem('data').then((data) => {
      this.setState({user: data});
    });
  };
  getToken = async () => {
    await AsyncStorage.getItem('token').then((data) => {
      this.setState({token: data});
    });
  };

  render() {
    if ((this.state.user && this.state.token) || this.state.isLogin) {
      return (
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
      );
    } else {
      if (this.state.page === 'login') {
        return (
          <LoginComponent
            loginHandler={this.loginHandler}
            pageHandler={this.pageHandler}
          />
        );
      } else if (this.state.page === 'register') {
        return <RegisterComponent pageHandler={this.pageHandler} />;
      }
    }
  }
}

export default App;
