import {HotspotWizard} from 'react-native-wifi-and-hotspot-wizard';
import {NetworkInfo} from 'react-native-network-info';
import {ExternalDirectoryPath} from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
let fileName = '';
let gotFileName = false;
let fileMode = false;
let fileBuffer = [];
var net = require('net');
export async function connectToHotspot() {
  let status, password, ssid;
  await HotspotWizard.turnOnHotspot().then((data) => {
    console.log('turning on wifi hotspot');
    console.log('data', data);

    if (data.status == 'success' || data.status == 'auth') {
      status = data.status;
      if (data.status == 'auth') {
        password = data.password;
        ssid = data.SSID;
      }
    } else {
      status = 'failed';
    }
  });
  return {status: status, password: password, ssid: ssid};
}

export async function makeServer(port, setIsReceiving, setFileName, setSent) {
  console.log('starting to make a server');
  let x;

  await NetworkInfo.getIPV4Address().then((ipv4Address) => {
    x = ipv4Address;
  });
  console.log('Local ip is ', x);
  let server = net
    .createServer((socket) => {
      console.log('socket created');
      socket.on('data', (data) => {
        console.log('on receiving data, value of fileMode is ', fileMode);
        // console.log('received data: ', data);
        if (fileMode) {
          if (data == 'EOF') {
            setSent(true);
            fileMode = false;
            makeFile(fileBuffer);
            fileBuffer = [];
          } else {
            if (!gotFileName) {
              fileName = data.toString('utf-8');
              setFileName(fileName);
              gotFileName = true;
            } else {
              fileBuffer.push(data);
            }
          }
        } else {
          if (data == 'CONNECTME') {
            console.log('replying as seri');
            socket.write('SERI');
          }
          if (data == 'SOF') {
            console.log('received SOF');
            fileMode = true;
            setIsReceiving(true);
          }
        }
      });

      socket.on('error', (error) => {
        fileMode = false;
        console.log('error aviral');
        console.log(error);
        console.log('error aviral');
        console.log('Error: ' + error);
      });

      socket.on('close', (error) => {
        fileMode = false;
        console.log('socket is closed.');
      });
    })
    .listen(port, () => {
      console.log('listening to port', port);
    });

  server.on('error', (error) => {
    fileMode = false;
    console.log('Server already listening on this port.');
  });

  server.on('close', () => {
    fileMode = false;
    console.log('server is closed.');
  });
  return {port: port, ip: x, server: server};
}

export function encryptIP(x) {
  var j = 0;
  let arr = '';
  let passcode = '';
  for (var i = 0; i < x.length; i++) {
    if (x[i] != '.') {
      j++;
      arr += x[i];
    } else {
      passcode += j;
      j = 0;
    }
  }
  passcode += j;
  passcode += arr;
  return passcode;
}

function makeFile(receivedBuffers) {
  RNFetchBlob.fs
    .writeStream(RNFetchBlob.fs.dirs.DownloadDir + '/' + fileName, 'base64')
    .then((stream) => {
      for (let i = 0; i < receivedBuffers.length; i++) {
        stream.write(receivedBuffers[i].toString('utf-8'));
      }
      console.log('File completely streamed');
      fileMode = false;
      console.log(fileMode);
      return stream.close();
    });
}
