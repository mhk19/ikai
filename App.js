import React, { createContext, useState } from "react";
import Connection from "./src/filetransfer/components/connection";

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
const App = () => {
  const [connection, setconnection] = useState(null);
  const [channel, setChannel] = useState(null);
  const updateConnection = (conn) => {
    setconnection(conn);
  };
  const updateChannel = (chn) => {
    setChannel(chn);
  };

  return (
    <ConnectionContext.Provider value={{ connection, updateConnection }}>
      <ChannelContext.Provider value={{ channel, updateChannel }}>
        <ConnectionConsumer>
          {({ connection, updateConnection }) => (
            <ChannelConsumer>
              {({ channel, updateChannel }) => (
                <Connection
                  connection={connection}
                  updateConnection={updateConnection}
                  channel={channel}
                  updateChannel={updateChannel}
                />
              )}
            </ChannelConsumer>
          )}
        </ConnectionConsumer>
      </ChannelContext.Provider>
    </ConnectionContext.Provider>
  );
};
export default App;
