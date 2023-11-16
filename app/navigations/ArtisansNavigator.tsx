import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {ArtisanHomeScreen} from '../screens/app-screens/';
import {ArtisansViewScreen} from '../screens/app-screens';
import type {NativeStackNavigationProp, NativeStackScreenProps} from '@react-navigation/native-stack';
import {ArtisanViewScreen} from '../screens/app-screens/';

export type ArtisanStackList = {
    ArtisanHomeScreen: undefined;
    ArtisansViewScreen: {
        serviceName: string;
        serviceGroupName: string;
        serviceCode: string;
    };
    ArtisanViewScreen: {
        artisanId: number;
    };
};

const ArtisanStack = createStackNavigator<ArtisanStackList>();

const ArtisansStackkNavigator = () => (
    <ArtisanStack.Navigator screenOptions={{headerShown: false}} initialRouteName='ArtisanHomeScreen'>
        <ArtisanStack.Screen name='ArtisanHomeScreen' component={ArtisanHomeScreen} />
        <ArtisanStack.Screen name='ArtisansViewScreen' component={ArtisansViewScreen} initialParams={{serviceName: 'Electricity', serviceGroupName: 'Electricians', serviceCode: 'electricity'}} />
        <ArtisanStack.Screen name='ArtisanViewScreen' component={ArtisanViewScreen} initialParams={{artisanId: 0}} />
    </ArtisanStack.Navigator>
);

export default ArtisansStackkNavigator;

export type ArtisanHomeScreenProps = NativeStackScreenProps<ArtisanStackList, 'ArtisanHomeScreen'>;
export type ArtisansViewScreenProps = NativeStackScreenProps<ArtisanStackList, 'ArtisansViewScreen'>;
export type ArtisanViewScreenProps = NativeStackScreenProps<ArtisanStackList, 'ArtisanViewScreen'>;

export type ArtisanHomeNavigationProp = NativeStackNavigationProp<ArtisanStackList, 'ArtisanHomeScreen'>;
export type ArtisansViewNavigationProp = NativeStackNavigationProp<ArtisanStackList, 'ArtisansViewScreen'>;
export type ArtisanViewNavigationProp = NativeStackNavigationProp<ArtisanStackList, 'ArtisanViewScreen'>;
