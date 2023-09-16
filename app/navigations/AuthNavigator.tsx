import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {
    LoginScreen,
    RegistrationScreen,
    ForgotPasswordScreen,
    OtpCodeScreen,
} from '../screens';

export type AuthStackList = {
    SignIn: undefined;
    SignUp: undefined;
    ForgotPassword: undefined;
    OtpCodeScreen: undefined;
};

const AuthStack = createStackNavigator<AuthStackList>();

const AuthStackNavigator = () => {
    const dre = 'dre';
    return (
        <AuthStack.Navigator
            screenOptions={{headerShown: false}}
            initialRouteName='OtpCodeScreen'
        >
            <AuthStack.Screen name='SignUp' component={RegistrationScreen} />
            <AuthStack.Screen name='SignIn' component={LoginScreen} />
            <AuthStack.Screen
                name='ForgotPassword'
                component={ForgotPasswordScreen}
            />
            <AuthStack.Screen name='OtpCodeScreen' component={OtpCodeScreen} />
        </AuthStack.Navigator>
    );
};

export default AuthStackNavigator;
