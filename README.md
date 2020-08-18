# ikai

A one stop app to scan, edit and share.

Before installing the application on your smartphone, please setup the [react-native development](https://reactnative.dev/docs/environment-setup) environment using the react-native-cli (and not expo).
## Installation (for android)
### Step 1:
After cloning the repo go into the root directory of ikai and run ```npm install``` to install the dependencies. A directory named node_modules would be made where all the dependencies get stored.
### Step 2:
Now inside the node_modules directory find the module named **react-native-wifi-and-hotspot-wizard***. <br />
Inside this module's directory, go to **/android/src/main/java/com/reactnativewifiandhotspotwizard/RNWifiAndHotspotWizardModule.java** and comment out line number **28** <br/>
```import android.net.wifi.ScanResult;
import android.widget.Toast;
// import sun.security.ec.point.ProjectivePoint.Mutable;   <----This line is to be commented
import android.os.Build;
import java.net.Inet4Address; 
```
<br />
<br />

Again, it the node_modules directory, find the module named **react-native-virgil-crypto**. <br />
Inside this module, open **android/build.gradle** and comment out line **93** to line **99** <br />
```
pom.project {
...
description packageJson.description
url packageJson.repository

// licenses {                                                        -  
//     license {                                                    -                                                    
//         name packageJson.license                                -                                                            
//         url packageJson.repository + '/blob/master/LICENSE'    -------------------These lines will be commented                               
//         distribution 'repo'                                     -                                         
//     }                                                            -                                                        
// }                                                                 -                                                     

developers {
    developer {
        ...
    }
}
   }
```
### Step 3:
After succesful installation of the dependencies, start the react-native development server by running ```react-native-start```.
### Step 4:
Keep the server running and in a separate terminal, run ```react-native run-android``` to start building the app for android system. This process would take some considerable amount of time. <br /><br />The app would start running on your phone after the process is executed.

## Features (Brief explanation of the tech stack)
The app has the following features:
### Document Scanner
Any document of a resonable size can be scanned with the help of the scanner provided in the app.
### Offline/Online File Transfer
The app has both offline and online transfer with incredibly fast speed. <br />
Offline sharing takes place through via wifi-hotspot. <br />
Online sharing uses p2p connections for sharing files. <br />
### Dedicated multimedia editor
We have added a video editor and a photo editor to enable editing of files within the app.
### Chat for collaboration
A history of files which were shared in the past is maintained in a chat-like form where two users can chat with each other like a normal messaging service. This would enhance the collaboration process in any project/task.

