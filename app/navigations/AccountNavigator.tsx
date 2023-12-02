import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import AccountDashboardScreen from '../screens/app-screens/account/AccountDashboardScreen';
import {type NativeStackScreenProps, type NativeStackNavigationProp} from '@react-navigation/native-stack';
import {type ChangeAccountProperty, ChangeAccountStateScreen, ChangeAccountBirthDateScreen} from '../screens/app-screens/account/ChangeAccountPropertyScreens';
import CreateArtisanProfileScreen from '../screens/app-screens/account/CreateArtisanProfile';

interface IdObject {
    id: number;
}
export type AccountStackList = {
    AccountDashboard: undefined;
    ChangeAccountState: IdObject;
    ChangeAccountBirthDate: IdObject;
    CreateArtisanProfile: undefined;
};

const AccountStack = createStackNavigator<AccountStackList>();

const AccountStackNavigator = () => (
    <AccountStack.Navigator screenOptions={{headerShown: false}} initialRouteName='AccountDashboard'>
        <AccountStack.Screen name='AccountDashboard' component={AccountDashboardScreen} />
        <AccountStack.Screen name='ChangeAccountState' component={ChangeAccountStateScreen} />
        <AccountStack.Screen name='ChangeAccountBirthDate' component={ChangeAccountBirthDateScreen} />
        <AccountStack.Screen name='CreateArtisanProfile' component={CreateArtisanProfileScreen} />
    </AccountStack.Navigator>
);

export type AccountDashboardScreenProps = NativeStackScreenProps<AccountStackList, 'AccountDashboard'>;
export type ChangeStateScreenProps = NativeStackScreenProps<AccountStackList, 'ChangeAccountState'>;
export type ChangeBirthDateScreenProps = NativeStackScreenProps<AccountStackList, 'ChangeAccountBirthDate'>;
export type CreateArtisanProfileScreenProps = NativeStackScreenProps<AccountStackList, 'CreateArtisanProfile'>;

export type AccountDashboardNavigationProp = NativeStackNavigationProp<AccountStackList, 'AccountDashboard'>;
export type ChangeStateNavigationProp = NativeStackNavigationProp<AccountStackList, 'ChangeAccountState'>;
export type ChangeBirthDateNavigationProp = NativeStackNavigationProp<AccountStackList, 'ChangeAccountBirthDate'>;
export type CreateArtisanProfileNavigationProp = NativeStackNavigationProp<AccountStackList, 'CreateArtisanProfile'>;

export default AccountStackNavigator;
