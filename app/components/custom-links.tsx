import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';

import * as metrics from '../utils/metrics';
import colors from '../config/colors';
import {useNavigation} from '@react-navigation/native';
import type {AuthStackList} from '../navigations/AuthNavigator';
import {type StackNavigationProp} from '@react-navigation/stack';

import AppText from './text';

interface AnAccountProps {
    linkText?: string;
}

export function HaveAnAccount({linkText = 'Sign in'}: AnAccountProps) {
    const navigation = useNavigation<StackNavigationProp<AuthStackList>>();
    return (
        <Pressable
            onPress={() => {
                navigation.navigate('SignIn');
            }}
            style={styles.accountPressable}
        >
            <AppText style={styles.haveAnAccount}>Already have an account? </AppText>
            <AppText style={[styles.haveAnAccount, {color: colors.primaryColor}]}>{linkText}</AppText>
        </Pressable>
    );
}

export function DonotHaveAnAccount({linkText = 'Sign up'}: AnAccountProps) {
    const navigation = useNavigation<StackNavigationProp<AuthStackList>>();
    return (
        <Pressable
            onPress={() => {
                navigation.navigate('SignUp');
            }}
            style={styles.accountPressable}
        >
            <AppText style={styles.haveAnAccount}>Don&apos;t have an account?&nbsp;</AppText>
            <AppText style={[styles.haveAnAccount, {color: colors.primaryColor}]}>{linkText}</AppText>
        </Pressable>
    );
}

export function ForgotPassword({linkText = 'Forgot Password?'}: AnAccountProps) {
    const navigation = useNavigation<StackNavigationProp<AuthStackList>>();
    return (
        <Pressable
            onPress={() => {
                navigation.navigate('ForgotPassword');
            }}
            style={styles.accountPressable}
        >
            <AppText style={[styles.haveAnAccount, {color: colors.primaryColor, marginLeft: 'auto'}]}>{linkText}</AppText>
        </Pressable>
    );
}

export function UseAsGuest() {
    return (
        <Pressable style={styles.useAsGuest}>
            <AppText style={styles.useAsGuestText}>Sign in as Guest</AppText>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    accountPressable: {
        marginTop: metrics.verticalScale(14),
        flexDirection: 'row',
        justifyContent: 'center',
    },
    haveAnAccount: {
        color: '#353537',
        fontSize: metrics.moderateScale(14),
    },
    useAsGuest: {
        marginTop: metrics.verticalScale(32),
        alignSelf: 'center',
    },
    useAsGuestText: {
        textAlign: 'center',
        color: colors.primaryColor600B,
        fontSize: metrics.moderateScale(12),
    },
});
