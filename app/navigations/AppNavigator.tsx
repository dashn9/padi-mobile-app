import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeScreen} from '../screens/app-screens';
import {AntDesign, Feather} from '@expo/vector-icons';
import colors from '../config/colors';
import {createStackNavigator} from '@react-navigation/stack';
import ArtisansStackkNavigator from './ArtisansNavigator';
import MessagesStackkNavigator from './MessagesNavigator';

export type AppNavList = {
    HomeScreenNavigator: undefined;
    MessagesScreenNavigator: undefined;
    AccountScreen: undefined;
    SupportScreen: undefined;
};

export type HomeScreenStackNavigator = {
    HomeScreen: undefined;
    ArtisansHomeScreen: undefined;
};

const Tab = createBottomTabNavigator<AppNavList>();
const HomeScreenStack = createStackNavigator<HomeScreenStackNavigator>();
const HomeScreenNavigator = () => (
    <HomeScreenStack.Navigator screenOptions={{headerShown: false}}>
        <HomeScreenStack.Screen name='HomeScreen' component={HomeScreen} />
        <HomeScreenStack.Screen name='ArtisansHomeScreen' component={ArtisansStackkNavigator} />
    </HomeScreenStack.Navigator>
);
const AppNavigator = () => (
    <Tab.Navigator screenOptions={{headerShown: false, tabBarActiveTintColor: colors.primaryColor}}>
        <Tab.Screen
            name='HomeScreenNavigator'
            component={HomeScreenNavigator}
            options={{
                tabBarLabel: 'Home',
                tabBarIcon({color, size}) {
                    return <AntDesign name='home' color={color} size={size} />;
                },
            }}
        />
        <Tab.Screen
            name='MessagesScreenNavigator'
            component={MessagesStackkNavigator}
            options={{
                tabBarLabel: 'Messages',
                tabBarIcon({color, size}) {
                    return <Feather name='pie-chart' color={color} size={size} />;
                },
            }}
        />
        <Tab.Screen
            name='SupportScreen'
            component={HomeScreen}
            options={{
                tabBarLabel: 'Support',
                tabBarIcon({color, size}) {
                    return <AntDesign name='customerservice' color={color} size={size} />;
                },
            }}
        />
        <Tab.Screen
            name='AccountScreen'
            component={HomeScreen}
            options={{
                tabBarLabel: 'Account',
                tabBarIcon({color, size}) {
                    return <AntDesign name='user' color={color} size={size} />;
                },
            }}
        />
    </Tab.Navigator>
);

export default AppNavigator;
