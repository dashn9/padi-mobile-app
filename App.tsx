import React, {useCallback, type ReactElement} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import AuthStackNavigator from './app/navigations/AuthNavigator';

// Imported for dev purpose.
import 'expo-dev-client';

// SplashScreen.preventAutoHideAsync();

export default function App(): ReactElement {
    const [fontsLoaded] = useFonts({
        karla: require('./app/assets/fonts/karla/Karla-VariableFont_wght.ttf'),
        karlaSemiBold: require('./app/assets/fonts/karla/static/Karla-SemiBold.ttf'),
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
        </NavigationContainer>
    );
}
