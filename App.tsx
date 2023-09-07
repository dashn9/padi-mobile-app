import React, {type ReactElement} from 'react';
import {Button, SafeAreaView, StyleSheet, Text} from 'react-native';
import RegistrationScreen from './app/screens/RegistrationScreen';

export default function App(): ReactElement {
    return (
        <SafeAreaView style={styles.container}>
            <RegistrationScreen />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
