import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import AccountDashboardScreen from '../screens/app-screens/account/AccountDashboardScreen';
import {type NativeStackScreenProps, type NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ChangeAccountStateScreen, ChangeAccountBirthDateScreen, ChangeArtisanBioScreen, ChangeArtisanServicesScreen} from '../screens/app-screens/account/ChangeAccountPropertyScreens';
import CreateArtisanProfileScreen from '../screens/app-screens/account/artisan/CreateArtisanProfile';
import ArtisanProfileDashboardScreen from '../screens/app-screens/account/artisan/ArtisanProfileDashboardScreen';
import {type ServiceLight} from '../hooks/queries/useArtisanQuery';

interface IdObject {
    id: number;
}
export type AccountStackList = {
    AccountDashboard: undefined;
    ChangeAccountState: IdObject;
    ChangeAccountBirthDate: IdObject;
    CreateArtisanProfile: undefined;
    ArtisanProfileDashboard: undefined;
    ChangeArtisanBio: {
        currentBio: string;
    };
    ChangeArtisanServices: {
        currentServices: ServiceLight[];
    };
};

const AccountStack = createStackNavigator<AccountStackList>();

const AccountStackNavigator = () => (
    <AccountStack.Navigator screenOptions={{headerShown: false}} initialRouteName='AccountDashboard'>
        <AccountStack.Screen name='AccountDashboard' component={AccountDashboardScreen} />
        <AccountStack.Screen name='ChangeAccountState' component={ChangeAccountStateScreen} />
        <AccountStack.Screen name='ChangeAccountBirthDate' component={ChangeAccountBirthDateScreen} />
        <AccountStack.Screen name='CreateArtisanProfile' component={CreateArtisanProfileScreen} />
        <AccountStack.Screen name='ArtisanProfileDashboard' component={ArtisanProfileDashboardScreen} />
        <AccountStack.Screen name='ChangeArtisanBio' component={ChangeArtisanBioScreen} />
        <AccountStack.Screen name='ChangeArtisanServices' component={ChangeArtisanServicesScreen} />
    </AccountStack.Navigator>
);

export type AccountDashboardScreenProps = NativeStackScreenProps<AccountStackList, 'AccountDashboard'>;
export type ChangeStateScreenProps = NativeStackScreenProps<AccountStackList, 'ChangeAccountState'>;
export type ChangeBirthDateScreenProps = NativeStackScreenProps<AccountStackList, 'ChangeAccountBirthDate'>;
export type CreateArtisanProfileScreenProps = NativeStackScreenProps<AccountStackList, 'CreateArtisanProfile'>;
export type ArtisanProfileDashboardScreenProps = NativeStackScreenProps<AccountStackList, 'ArtisanProfileDashboard'>;
export type ChangeArtisanBioScreenProps = NativeStackScreenProps<AccountStackList, 'ChangeArtisanBio'>;
export type ChangeArtisanServicesScreenProps = NativeStackScreenProps<AccountStackList, 'ChangeArtisanServices'>;

export type AccountDashboardNavigationProp = NativeStackNavigationProp<AccountStackList, 'AccountDashboard'>;
export type ChangeStateNavigationProp = NativeStackNavigationProp<AccountStackList, 'ChangeAccountState'>;
export type ChangeBirthDateNavigationProp = NativeStackNavigationProp<AccountStackList, 'ChangeAccountBirthDate'>;
export type CreateArtisanProfileNavigationProp = NativeStackNavigationProp<AccountStackList, 'CreateArtisanProfile'>;
export type ArtisanProfileDashboardNavigationProp = NativeStackNavigationProp<AccountStackList, 'ArtisanProfileDashboard'>;
export type ChangeArtisanBioNavigationProp = NativeStackNavigationProp<AccountStackList, 'ChangeArtisanBio'>;
export type ChangeArtisanServicesNavigationProp = NativeStackNavigationProp<AccountStackList, 'ChangeArtisanServices'>;

export default AccountStackNavigator;
