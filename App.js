import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';

import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import {Importance} from 'react-native-push-notification';



import UserContextProvider from './contexts/UserContext';
import MainStack from './stacks/MainStack';
import AsyncStorage from '@react-native-async-storage/async-storage';


const fetchFonts = () => {
  return Font.loadAsync({
    'regular': require('./fontes/OpenSans-Regular.ttf'),
    'bold': require('./fontes/OpenSans-Bold.ttf'),
  })
};

// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    AsyncStorage.setItem('fcm_token', token.token );
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);

    // process the notification
    PushNotification.localNotification( {
      ...notification, 
      channelId: 'default-channel-id', 
      largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
      smallIcon: 'ic_notification',  
      soundName: "default" 
    });

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);

    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function(err) {
    console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,
});


export default () => {

  PushNotification.createChannel(
    {
      channelId: "default-channel-id", // (required)
      channelName: `Default channel`, // (required)
      channelDescription: "A default channel", // (optional) default: undefined.
      soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
      importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
    },
    (created) => console.log(`createChannel 'default-channel-id' returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  );

  const [fontLoaded, setFontLoaded] = useState(false);

  // if (!fontLoaded) {
  //   return < AppLoading
  //     startAsync={fetchFonts}
  //     onFinish={() => setFontLoaded(true)}
  //   />
  // }


  return (
    <UserContextProvider>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </UserContextProvider>
  );
}