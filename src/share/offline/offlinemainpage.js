import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {OfflineMainPage} from './mainpage';
import {MainHeader} from '../../ikai/components/header';
import {NavigationContainer} from '@react-navigation/native';

const OfflineStack = createStackNavigator();

export const Offline = () => {
  return (
    <OfflineMainPage />
    // <NavigationContainer independent={true}>
    //   <OfflineStack.Navigator initialRouteName="offlinemainscreen">
    //     <OfflineStack.Screen
    //       name="offlinemainscreen"
    //       component={OfflineMainPage}
    //       options={{
    //         header: () => {
    //           return (
    //             <MainHeader
    //               source={require('../assets/share_header.png')}
    //               view={true}
    //               open={false}
    //             />
    //           );
    //         },
    //       }}
    //     />
    //   </OfflineStack.Navigator>
    // </NavigationContainer>
  );
};
export default Offline;
