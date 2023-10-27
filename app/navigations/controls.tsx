import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import type {ViewStyle} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';

import * as metrics from '../utils/metrics';
import AppText from '../components/text';
import {useNavigation} from '@react-navigation/native';

interface BackProps {
    style?: ViewStyle;
    color?: string;
    backStepCount?: number;

    design?: 'default' | 'back-icon-only' | 'back-icon-only-2';
}
export function Back({style, backStepCount = 1, color = '#999', design = 'default'}: BackProps) {
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
                    {design === 'default' || design === 'back-icon-only' ? <MaterialCommunityIcons name='pan-left' size={24} color={color} /> : design === 'back-icon-only-2' ? <MaterialCommunityIcons name='arrow-left-thin' size={30} color={color} /> : null}
                    {design === 'default' ? <AppText style={{color, fontSize: 16}}> Back</AppText> : null}
                </Pressable>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    backMainContainer: {
        position: 'absolute',
        top: metrics.verticalScale(148),
        zIndex: 99,
    },
    backContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
