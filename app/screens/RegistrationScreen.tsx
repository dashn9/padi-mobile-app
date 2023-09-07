import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

function RegistrationScreen() {
    return (
        <View style={styles.mainViewContainer}>
            <View style={styles.registrationTriggersContainer}>
                <View style={styles.registerButton}>
                    <Text style={styles.registerButtonText}>Register</Text>
                </View>
            </View>
        </View>
    );
}

const primaryColor = '#1D4ED8';

const styles = StyleSheet.create({
    mainViewContainer: {
        flex: 1,
        width: '100%',
    },
    registrationTriggersContainer: {
        borderColor: 'red',
        borderWidth: 8,
        height: '30%',
        width: '100%',
        justifyContent: 'center',
        alignContent: 'center',
    },
    registerButton: {
        backgroundColor: primaryColor,
        width: '70%',
        margin: 'auto',
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 30,
        padding: 5,
    },
});

export default RegistrationScreen;
