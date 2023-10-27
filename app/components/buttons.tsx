import React from 'react';
import {Image, StyleSheet, Pressable, Text, ActivityIndicator} from 'react-native';

import * as metrics from '../utils/metrics';
import colors from '../config/colors';
import fonts from '../config/fonts';
import icons from '../config/icons';
import loadingContext from '../hooks/contexts/LoadingContext';

interface FormButtonProps {
    text: string;
    onPress?: () => void | undefined;
}

interface FormButton2Props extends FormButtonProps {
    iconName?: 'google' | 'apple' | 'facebook';
}

export function FormButton({text, onPress}: FormButtonProps) {
    return (
        <Pressable style={styles.formButton} onPress={onPress}>
            <Text style={styles.formButtonText}>{text}</Text>
            <ActivityIndicator color='#fff' />
        </Pressable>
    );
}

// This form button is most useful with external authentications
export function FormButton2({text, onPress, iconName}: FormButton2Props) {
    return (
        <Pressable style={{...styles.formButton, ...styles.formButton2}} onPress={onPress}>
            {iconName === 'google' ? (
                <Image
                    style={{
                        width: icons.authIconDimension,
                        height: icons.authIconDimension,
                    }}
                    source={require('../assets/icons/google-48.png')}
                />
            ) : (
                ''
            )}
            <Text style={[styles.formButtonText, styles.formButtonText2]}>{text}</Text>
            <ActivityIndicator color={colors.primaryColor} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    formButton: {
        backgroundColor: colors.primaryColor,
        padding: metrics.moderateScale(16),
        borderRadius: 8,
        marginTop: metrics.verticalScale(14),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    formButton2: {
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: 'D0D5DD',
    },
    formButtonText: {
        color: '#fff',
        fontSize: fonts.buttonFontSize,
        textAlign: 'center',
        fontWeight: fonts.buttonFontWeight,
        fontFamily: fonts.primaryFontFamily,
        marginRight: metrics.horizontalScale(6),
    },
    formButtonText2: {
        color: colors.formInputColor,
        marginLeft: metrics.horizontalScale(10),
    },
});
