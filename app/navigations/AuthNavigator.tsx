import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {LoginScreen, RegistrationScreen, ForgotPasswordScreen, OtpCodeScreen, ResetPasswordScreen} from '../screens/authentication-screens';
import HomeScreen from '../screens/app-screens/HomeScreen';

export type AuthStackList = {
    SignIn: undefined;
    SignUp: undefined;
    ForgotPassword: undefined;
    OtpCodeScreen:
        | {
              context: 'email-verification' | 'password-reset' | 'two-factor-authentication';
              email: string;
          }
        | {context: 'session-authenticate'; email: never};
    ResetPasswordScreen: undefined;
    HomeScreen: undefined;
};

const AuthStack = createStackNavigator<AuthStackList>();

const AuthStackNavigator = () => {
    const dre = 'dre';
    return (
        <AuthStack.Navigator screenOptions={{headerShown: false}} initialRouteName='SignIn'>
            <AuthStack.Screen name='SignUp' component={RegistrationScreen} />
            <AuthStack.Screen name='SignIn' component={LoginScreen} />
            <AuthStack.Screen name='ForgotPassword' component={ForgotPasswordScreen} />
            <AuthStack.Screen name='OtpCodeScreen' component={OtpCodeScreen} initialParams={{context: 'session-authenticate'}} />
            <AuthStack.Screen name='ResetPasswordScreen' component={ResetPasswordScreen} />
            <AuthStack.Screen name='HomeScreen' component={HomeScreen} />
        </AuthStack.Navigator>
    );
};

export default AuthStackNavigator;
