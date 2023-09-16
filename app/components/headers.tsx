import React from 'react';
import {StyleSheet, Text} from 'react-native';
import type {ViewStyle} from 'react-native';

import * as metrics from '../metrics/metrics';
import colors from '../config/colors';

interface HeaderProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export function Header1({children, style}: HeaderProps) {
    return (
        <Text style={[styles.header, styles.header1, style]}>{children}</Text>
    );
}

export function Subtitle2({children}: HeaderProps) {
    return <Text style={[styles.subtile, styles.subtitle2]}>{children}</Text>;
}

const styles = StyleSheet.create({
    header: {
        color: colors.headerColor,
    },
    header1: {
        fontSize: metrics.moderateScale(28),
        fontFamily: 'karlaSemiBold',
        marginTop: metrics.verticalScale(42),
    },
    subtile: {
        color: colors.subtitleColor,
    },
    subtitle2: {
        fontSize: metrics.moderateScale(14),
        fontWeight: '300',
        marginTop: metrics.verticalScale(10),
    },
});
