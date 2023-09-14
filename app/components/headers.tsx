import React from 'react';
import { StyleSheet, Text } from 'react-native';

import colors from '../config/colors';

interface HeaderProps {
    children: React.ReactNode
}

export function Header1({children}: HeaderProps) {
    return (
        <Text style={{...styles.header, ...styles.header1}}>
            {children}
        </Text>
    )
}

export function Subtitle2({children}: HeaderProps) {
    return (
        <Text style={{...styles.subtile, ...styles.subtitle2}}>
            {children}
        </Text>
    )
}

const styles = StyleSheet.create({
    header: {
        color: colors.headerColor,
    },
    header1: {
        fontSize: 28,
        fontWeight: '600',
        marginTop: 42,
    },
    subtile: {
        color: colors.subtitleColor,
    },
    subtitle2: {
        fontSize: 14,
        fontWeight: '300',
        marginTop: 10,
    }

})