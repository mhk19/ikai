import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ImageDetailScreen} from './imagedetails';
import {ImageResultScreen} from './imageresults';
import {ScannerMainPage} from './scannermainpage';
import {MainHeader} from '../../ikai/components/header';

const CamscannerStack = createStackNavigator();

export class Scanner extends React.Component {
  constructor(props) {
    super(props);
    this.open = props.route.params.user;
  }

  render() {
    return (
      <CamscannerStack.Navigator initialRouteName="scannerMainscreen">
        <CamscannerStack.Screen
          name="imageDetails"
          component={ImageDetailScreen}></CamscannerStack.Screen>
        <CamscannerStack.Screen
          name="imageResults"
          component={ImageResultScreen}
          initialParams={{
            navigation: this.props.navigation,
          }}></CamscannerStack.Screen>
        <CamscannerStack.Screen
          name="scannerMainscreen"
          component={ScannerMainPage}
          options={{
            header: () => {
              return (
                <MainHeader
                  source={require('../../../assets/images/camscanner/scanner_header.png')}
                  view={true}
                  open={this.open}
                />
              );
            },
          }}></CamscannerStack.Screen>
      </CamscannerStack.Navigator>
    );
  }
}
export default Scanner;
