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
import {FA5Style} from 'react-native-vector-icons/FontAwesome5';
const Tab = createBottomTabNavigator();
const InitialPage = 'share';

export class App extends React.Component {
  constructor(props) {
    super(props);
    initScanBotSdk().then((r) => console.log(r));
    this.state = {
      user: null,
      token: null,
      private_key: null,
      isLogin: false,
      page: 'login',
    };
    this.getToken();
    this.getUser().then(() => this.getPrivKey(this.state.user));
    this.loginHandler = this.loginHandler.bind(this);
    this.pageHandler = this.pageHandler.bind(this);
    this.setPrivateKey = this.setPrivateKey.bind(this);
    this.logOutHander = this.logOutHander.bind(this);
    this.getPrivKey = this.getPrivKey.bind(this);
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
  getUser = async () => {
    await AsyncStorage.getItem('username').then((data) => {
      console.log('got logged in user', data);
      this.setState({user: data});
    });
  };
  getToken = async () => {
    await AsyncStorage.getItem('token').then((data) => {
      console.log('got token', data);
      this.setState({token: data});
    });
  };
  getPrivKey = async (user) => {
    await AsyncStorage.getItem(user + '_private_key').then((data) => {
      console.log('got private Key:', data);
      this.setState({private_key: data});
    });
  };

  setPrivateKey = async (name, key) => {
    await AsyncStorage.setItem(`${name}_private_key`, key);
    console.log('Stored private key', key);
    this.setState({private_key: key});
  };
  removeToken = async () => {
    await AsyncStorage.removeItem('token');
    console('token removed');
  };
  removeUser = async () => {
    await AsyncStorage.removeItem('user');
    console.log('user removed');
  };
  logOutHander() {
    this.removeUser();
    this.removeToken();
    this.setState({
      user: null,
      token: null,
      private_key: null,
      isLogin: false,
      page: 'login',
    });
  }
  render() {
    if (
      (this.state.user && this.state.token && this.state.private_key) ||
      this.state.isLogin
    ) {
      // if (!true) {
      return (
        <Drawer
          ref={(ref) => (this._drawer = ref)}
          content={<Menu logoutHandler={this.logOutHander} />}
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
            private_key={this.state.private_key}
            getPrivKey={this.getPrivKey}
          />
        );
      } else if (this.state.page === 'register') {
        return (
          <RegisterComponent
            pageHandler={this.pageHandler}
            setPrivateKey={this.setPrivateKey}
          />
        );
      }
    }
  }
}

export default App;
