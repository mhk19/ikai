import {View, Text, Button} from 'react-native';
import ScanbotSDK from 'react-native-scanbot-sdk';
import React, {createContext} from 'react';
import {Colors} from './android/app/model/Colors';
import initScanBotSdk from './src/camscanner/init';
import {ScannerMainPage} from './src/camscanner/components/mainpage';
import Connection from './src/file-transfer/components/connection';

const ConnectionContext = createContext({
  connection: null,
  updateConnection: () => {},
});
const ChannelContext = createContext({
  channel: null,
  updateChannel: () => {},
});

const ConnectionConsumer = ConnectionContext.Consumer;
const ChannelConsumer = ChannelContext.Consumer;

export class App extends React.Component {
  constructor(props) {
    super(props);
    initScanBotSdk().then((r) => console.log(r));
    this.state = {
      connection: null,
      channel: null,
    };
    this.updateChannel = this.updateChannel.bind(this);
    this.updateConnection = this.updateConnection.bind(this);
  }

  updateConnection(conn) {
    this.setState({connection: conn});
  }

  updateChannel(chn) {
    this.setState({channel: chn});
  }

  render() {
    return (
      <ConnectionContext.Provider
        value={(this.state.connection, this.updateConnection)}>
        <ChannelContext.Provider
          value={(this.state.channel, this.updateChannel)}>
          <ConnectionConsumer>
            {({connection, updateConnection}) => (
              <ChannelConsumer>
                {({channel, updateChannel}) => (
                  <Connection
                    connection={this.state.connection}
                    updateConnection={this.updateConnection}
                    channel={this.state.channel}
                    updateChannel={this.updateChannel}
                  />
                )}
              </ChannelConsumer>
            )}
          </ConnectionConsumer>
        </ChannelContext.Provider>
      </ConnectionContext.Provider>
    );
  }
}

export default App;
