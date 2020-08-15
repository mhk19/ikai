import React, { useState } from 'react';
import { View, Text, Dimensions, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Button from 'apsl-react-native-button';
import style from '../model/style';
import { WifiWizard } from 'react-native-wifi-and-hotspot-wizard';
import Toast from 'react-native-simple-toast';
var net = require('net');

const SocketConnect = (props) => {
  let win = Dimensions.get('window');
  let serverPort = 7251, WifiPasscode;

  function connectToServer(WifiPasscode) {
    let client = net.createConnection(serverPort, WifiPasscode, () => {
      console.log('opened client on ' + JSON.stringify(client.address()));
      client.write('Hello, server! Love, Client.');
    });

    client.on('data', (data) => {
      console.log('Client Received: ' + data);

      if (data === 'Verified') {
        Toast.show('Socket Created')
      }

      // this.client.destroy(); // kill client after server's response
      // this.server.close();
    });

    client.on('error', (error) => {
      console.log('client error ' + error);
    });

    client.on('close', () => {
      this.client.destroy(); // kill client after server's response
      this.server.close();
      console.log('client close');
    });
  }

  function startServer() {
    let server = net.createServer((socket) => {
      console.log('server connected on ' + JSON.stringify(socket.address()));

      socket.on('data', (data) => {
        console.log('Server Received: ' + data);
        socket.write('Verified\r\n');
      });

      socket.on('error', (error) => {
        console.log('error ' + error);
      });

      socket.on('close', (error) => {
        console.log('server client closed ' + (error ? error : ''));
      });
    }).listen(serverPort, () => {
      console.log('opened server on ' + JSON.stringify(server.address()));
    });

    server.on('error', (error) => {
      console.log('error ' + error);
    });

    server.on('close', () => {
      console.log('server close');
    });
  };
}

export default SocketConnect;
