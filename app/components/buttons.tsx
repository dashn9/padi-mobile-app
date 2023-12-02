import React from 'react';
import {Image, StyleSheet, Pressable, Text, ActivityIndicator, type ViewStyle, type TextStyle} from 'react-native';

import * as metrics from '../utils/metrics';
import colors from '../config/colors';
import fonts from '../config/fonts';
import icons from '../config/icons';
import loadingContext from '../hooks/contexts/LoadingContext';

interface ButtonProps {
    icon?: React.ReactElement;
    onPress?: () => void | undefined;
    isLoading?: boolean;
    text: string;
    buttonStyle?: ViewStyle;
    textStyle?: TextStyle;
}
interface FormButtonProps extends Omit<ButtonProps, 'icon' | 'buttonStyle' | 'textStyle'> {
    text: string;
    onPress?: () => void | undefined;
    isLoading?: boolean;
}

interface FormButton2Props extends FormButtonProps {
    iconName?: 'google' | 'apple' | 'facebook';
}

export function FormButton({text, onPress, isLoading = false}: FormButtonProps) {
    return (
        <Pressable style={[styles.button, styles.formButton]} onPress={onPress}>
            <Text style={styles.formButtonText}>{text}</Text>
            {isLoading ? <ActivityIndicator color='#fff' /> : null}
        </Pressable>
    );
}

// This form button is most useful with external authentications
export function FormButton2({text, onPress, iconName, isLoading = false}: FormButton2Props) {
    return (
        <Pressable style={[styles.button, styles.formButton, styles.formButton2]} onPress={onPress}>
            {iconName === 'google' ? (
                <Image
                    style={{
                        width: icons.xl2,
                        height: icons.xl2,
                    }}
                    source={require('../assets/icons/google-48.png')}
                />
            ) : (
                ''
            )}
            <Text style={[styles.formButtonText, styles.formButtonText2]}>{text}</Text>
            {isLoading ? <ActivityIndicator color={colors.primaryColor} /> : null}
        </Pressable>
    );
}

export function Button({text, onPress, icon, isLoading, buttonStyle, textStyle}: ButtonProps) {
    return (
        <Pressable style={[styles.button, buttonStyle]} onPress={onPress}>
            {icon}
            <Text style={[styles.buttonText, textStyle]}>{text}</Text>
            {isLoading ? <ActivityIndicator color='#fff' /> : null}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primaryColor,
        alignSelf: 'flex-start',
        padding: metrics.moderateScale(8),
        borderRadius: 4,
    },
    formButton: {
        padding: metrics.moderateScale(16),
        borderRadius: 8,
        marginTop: metrics.verticalScale(14),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'auto',
    },
    formButton2: {
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: 'D0D5DD',
    },

    buttonText: {
        color: colors.white,
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
