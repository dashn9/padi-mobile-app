import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import type {ViewStyle} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';

import * as metrics from '../metrics/metrics';
import AppText from '../components/text';
import {useNavigation} from '@react-navigation/native';

interface BackProps {
    style?: ViewStyle;
    backStepCount?: number;
}
export function Back({style, backStepCount = 1}: BackProps) {
    const navigation = useNavigation();
    if (navigation.canGoBack()) {
        return (
            <View style={[styles.backMainContainer, style]}>
                <Pressable
                    style={styles.backContainer}
                    onPress={() => {
                        for (let i = 0; i < backStepCount; i++) {
                            navigation.goBack();
                        }
                    }}
                >
                    <MaterialCommunityIcons name='pan-left' size={24} color={'#999'} />
                    <AppText style={{color: '#999', fontSize: 16}}> Back</AppText>
                </Pressable>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    backMainContainer: {
        width: '85%',
        position: 'absolute',
        top: metrics.verticalScale(148),
        zIndex: 99,
    },
    backContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
