import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import type {TextStyle, ViewStyle} from 'react-native';

import * as metrics from '../utils/metrics';
import colors from '../config/colors';
import AppText from './text';
import {Back} from '../navigations/controls';

interface HeaderProps {
    children: React.ReactNode;
    style?: ViewStyle | TextStyle;
    backable?: boolean;
}

export function Header1({children, style}: HeaderProps) {
    return <Text style={[styles.header, styles.header1, style]}>{children}</Text>;
}

export function Header2({children, style}: HeaderProps) {
    return <Text style={[styles.header, styles.header2, style]}>{children}</Text>;
}

export function Header3({children, style}: HeaderProps) {
    return <Text style={[styles.header, styles.header3, style]}>{children}</Text>;
}

export function Header4({children, style}: HeaderProps) {
    return <Text style={[styles.header, styles.header4, style]}>{children}</Text>;
}

export function Subtitle2({children, style}: HeaderProps) {
    return <Text style={[styles.subtile, styles.subtitle2, style]}>{children}</Text>;
}

export function HomeHeader({children, style}: HeaderProps) {
    return (
        <View style={[styles.homeHeader, style]}>
            <AppText style={[styles.homeHeaderText]}>{children}</AppText>
        </View>
    );
}

export function AppHeader({children, style, backable = true}: HeaderProps) {
    return (
        <View style={[styles.headerContainer, style]}>
            {backable ? <Back style={{top: -4, left: 0}} design='back-icon-only-2' color='#555' /> : null}
            <Header3 style={{marginTop: 0}}>{children}</Header3>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        color: colors.headerColor,
    },
    header1: {
        fontSize: metrics.moderateScale(28),
        fontFamily: 'karlaBold',
        marginTop: metrics.verticalScale(42),
    },
    header2: {
        fontSize: metrics.moderateScale(24),
        fontFamily: 'karlaSemiBold',
        marginTop: metrics.verticalScale(34),
    },
    header3: {
        fontSize: metrics.moderateScale(20),
        fontFamily: 'karlaSemiBold',
        marginTop: metrics.verticalScale(26),
    },
    header4: {
        fontSize: metrics.moderateScale(16),
        fontFamily: 'karlaSemiBold',
        marginTop: metrics.verticalScale(20),
    },
    subtile: {
        color: colors.subtitleColor,
    },
    subtitle2: {
        fontSize: metrics.moderateScale(14),
        fontWeight: '300',
        marginTop: metrics.verticalScale(10),
    },
    homeHeader: {},
    homeHeaderText: {
        fontSize: metrics.moderateScale(18),
        fontFamily: 'karlaBold',
        color: colors.homeHeaderColor,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: metrics.verticalScale(32),
    },
});
