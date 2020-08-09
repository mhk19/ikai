import React from 'react';
import startDocumentScanner from '../utils/scanner';
import {View, Button} from 'react-native';

function startScanner() {
  startDocumentScanner();
}
export class ScannerMainPage extends React.Component {
  render() {
    return (
      <View>
        <Button title="scanner" onPress={startScanner}>
          Open Scanner
        </Button>
      </View>
    );
  }
}
export default ScannerMainPage;
