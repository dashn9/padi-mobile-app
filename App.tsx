import React, {useCallback, type ReactElement, useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import AuthStackNavigator from './app/navigations/AuthNavigator';
import AppNavigator from './app/navigations/AppNavigator';
import {AuthContextProvider, useAuthContext} from './app/hooks/contexts/AuthContext';

// TO DO: Once you have successfully completed artisans and apartments, seperate all colors, fonts, icon sizes, lists, regexps, also paddings and margins, to their respective config
// Do not describe by where it is used, but rather the nature of it's value (e.g artisanProfileIcon(Not Allowed) XXL(Allowed)), to improve Re_Useability
// Keep all variables declared tight, i.e use a value in place rather than create a new one, if new one won't be used frequently, unless necessary.

// Imported for dev purpose.
import 'expo-dev-client';

// SplashScreen.preventAutoHideAsync();

// This code was added because for some reason atob and btoa(which are required by jwt-decode) are not present except when used in connection with browser
import {decode, encode} from 'base-64';
import useAuth from './app/hooks/useAuth';

if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}

function NavContainer() {
    const {user} = useAuthContext();
    const {retrieveAndSetUser, refreshAccessToken} = useAuth();

    // It(useEffect) behaves as the onComponentMount lifecycle hook
    useEffect(() => {
        retrieveAndSetUser()
            .then(() => {
                void 0;
            })
            .catch(e => {
                console.log(e);
            });
    }, []);

    return <NavigationContainer>{user?.isAuthenticated ? <AppNavigator /> : <AuthStackNavigator />}</NavigationContainer>;
}

export default function App(): ReactElement {
    const [fontsLoaded] = useFonts({
        karla: require('./app/assets/fonts/karla/Karla-VariableFont_wght.ttf'),
        karlaSemiBold: require('./app/assets/fonts/karla/static/Karla-SemiBold.ttf'),
        karlaBold: require('./app/assets/fonts/karla/static/Karla-Bold.ttf'),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return <></>;
    }

    return (
        <AuthContextProvider>
            <NavContainer />
        </AuthContextProvider>
    );
}
