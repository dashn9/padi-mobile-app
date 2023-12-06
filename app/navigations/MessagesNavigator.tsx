import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import MessagesHomeScreen from '../screens/app-screens/messages/MessagesHomeScreen';
import type {NativeStackNavigationProp, NativeStackScreenProps} from '@react-navigation/native-stack';
import {DirectMessageChatScreen} from '../screens/app-screens';

export type MessagesStackList = {
    MessagesHomeScreen: undefined;
    DirectMessageChatScreen: {
        recipientId: number; // Technically the user id of the person you want to chat with
    };
};

const MessagesStack = createStackNavigator<MessagesStackList>();

const MessagesStackkNavigator = () => (
    <MessagesStack.Navigator screenOptions={{headerShown: false}} initialRouteName='MessagesHomeScreen'>
        <MessagesStack.Screen name='MessagesHomeScreen' component={MessagesHomeScreen} />
        <MessagesStack.Screen name='DirectMessageChatScreen' component={DirectMessageChatScreen} />
    </MessagesStack.Navigator>
);

export default MessagesStackkNavigator;

export type MessagesHomeScreenProps = NativeStackScreenProps<MessagesStackList, 'MessagesHomeScreen'>;
export type DirectMessageChatScreenProps = NativeStackScreenProps<MessagesStackList, 'DirectMessageChatScreen'>;

export type MessagesHomeNavigationProp = NativeStackNavigationProp<MessagesStackList, 'MessagesHomeScreen'>;
export type DirectMessageChatNavigationProp = NativeStackNavigationProp<MessagesStackList, 'DirectMessageChatScreen'>;
