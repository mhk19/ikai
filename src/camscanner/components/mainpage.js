import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ImageDetailScreen} from './imagedetails';
import {ImageResultScreen} from './imageresults';
import {ScannerMainPage} from './scannermainpage';

const CamscannerStack = createStackNavigator();

export class Scanner extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <CamscannerStack.Navigator
        initialRouteName="scannerMainscreen"
        headerMode="none">
        <CamscannerStack.Screen
          name="imageDetails"
          component={ImageDetailScreen}></CamscannerStack.Screen>
        <CamscannerStack.Screen
          name="imageResults"
          component={ImageResultScreen}></CamscannerStack.Screen>
        <CamscannerStack.Screen
          name="scannerMainscreen"
          component={ScannerMainPage}></CamscannerStack.Screen>
      </CamscannerStack.Navigator>
    );
  }
}
export default Scanner;
