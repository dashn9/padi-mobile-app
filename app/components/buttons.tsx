import React from 'react';
import { Image, StyleSheet, Pressable, Text } from 'react-native';

import colors from '../config/colors';
import fonts from '../config/fonts';
import icons from '../config/icons';

interface FormButtonProps {
    text: string,
    onPress?: () => void | null,
}

interface FormButton2Props extends FormButtonProps {
    iconName?: 'google' | 'apple' | 'facebook'
}

export function FormButton({ text, onPress }: FormButtonProps) {

    return (
        <Pressable style={styles.formButton} onPress={onPress}>
            <Text style={styles.formButtonText}>{text}</Text>
        </Pressable>
    );
}

// This form button is most useful with external authentications
export function FormButton2({ text, onPress, iconName }: FormButton2Props) {

    return (
        <Pressable style={{...styles.formButton, ...styles.formButton2}} onPress={onPress}>
            {iconName == 'google' ? <Image style={{width: icons.authIconDimension, height: icons.authIconDimension}} source={require('../assets/icons/google-48.png')} /> : ''}
            <Text style={{...styles.formButtonText, ...styles.formButtonText2}}>{text}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    formButton: {
        backgroundColor: colors.primaryColor,
        padding: 16,
        borderRadius: 8,
        marginTop: 14,
    },
    formButton2: {
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: "D0D5DD",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    formButtonText: {
        color: '#fff',
        fontSize: fonts.buttonFontSize,
        textAlign: 'center',
        fontWeight: fonts.buttonFontWeight,
        fontFamily: fonts.primaryFontFamily
    },
    formButtonText2: {
        color: colors.formInputColor,
        marginLeft: 10,
    }
})