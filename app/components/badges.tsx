import React from 'react';
import {View, StyleSheet} from 'react-native';
import fonts from '../config/fonts';
import colors from '../config/colors';
import * as metrics from '../utils/metrics';
import AppText from './text';

interface InewMessagesCountBadgeProps {
    count: number; // The actual count
    truncateValue?: number;
}

export function NewMessagesCountBadge({count, truncateValue = 99}: InewMessagesCountBadgeProps) {
    const newCount = count < 0 ? 0 : count;
    const displayCount = newCount > truncateValue ? `${truncateValue}+` : newCount.toString();

    return (
        <View style={styles.newMessagesCountBadge}>
            <AppText style={styles.newMessagesCount}>{displayCount}</AppText>
        </View>
    );
}

interface ItagBadge {
    children: React.ReactNode;
}
export function TagBadge({children}: ItagBadge) {
    return (
        <View style={styles.tagBadgeContainer}>
            <AppText style={styles.tagBadgeText}>{children}</AppText>
        </View>
    );
}

const styles = StyleSheet.create({
    // New Messages Count Badege
    newMessagesCountBadge: {
        backgroundColor: colors.primaryColor600B,
        // Both the width and the height have to be the same in this scenario because both sides have to be equal
        width: metrics.verticalScale(24),
        height: metrics.verticalScale(24),
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    newMessagesCount: {
        color: colors.white,
        fontSize: fonts.normal,
    },

    // Tag Badge
    tagBadgeContainer: {
        padding: metrics.verticalScale(4),
        backgroundColor: colors.primaryColor200B,
        borderRadius: 4,
        marginLeft: 6,
    },
    tagBadgeText: {
        fontSize: fonts.normal,
    },
});
