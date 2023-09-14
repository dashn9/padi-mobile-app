import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import colors from '../config/colors';

interface HaveAnAccountProps {
    linkText?: string
};

export function HaveAnAccount({linkText = 'Sign In'}: HaveAnAccountProps) {
    return (
        <Text style={styles.haveAnAccount}>
            Already have an account? Sign in.
        </Text>
    );
};

export function UseAsGuest() {
    return (
        <Pressable style={styles.useAsGuest}>
            <Text style={styles.useAsGuestText}>
                Sign in as Guest
            </Text>
        </Pressable>
    );
};



const styles = StyleSheet.create({
    haveAnAccount: {
        color: '#353537',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 14,
    },
    useAsGuest: {
        marginTop: 32,
        alignSelf: 'center',
    },
    useAsGuestText: {
        textAlign: 'center',
        color: colors.primaryColor500,
        fontSize: 12,
    }
});
