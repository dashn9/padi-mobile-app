import React, {useCallback, type ReactElement} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import AuthStackNavigator from './app/navigations/AuthNavigator';
import AppNavigator from './app/navigations/AppNavigator';

// TO DO: Once you have successfully completed artisans and apartments, seperate all colors, fonts, icon sizes, lists, regexps, also paddings and margins, to their respective config
// Do not describe by where it is used, but rather the nature of it's value (e.g artisanProfileIcon(Not Allowed) XXL(Allowed)), to improve Re_Useability
// Keep all variables declared tight, i.e use a value in place rather than create a new one, if new one won't be used frequently, unless necessary.

// Imported for dev purpose.
import 'expo-dev-client';

// SplashScreen.preventAutoHideAsync();

export default function App(): ReactElement {
    const [fontsLoaded] = useFonts({
        karla: require('./app/assets/fonts/karla/Karla-VariableFont_wght.ttf'),
        karlaSemiBold: require('./app/assets/fonts/karla/static/Karla-SemiBold.ttf'),
        karlaBold: require('./app/assets/fonts/karla/static/Karla-Bold.ttf'),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return <></>;
    }

    return (
        <NavigationContainer>
            <AuthStackNavigator />
            {/* <AppNavigator /> */}
        </NavigationContainer>
    );
}
