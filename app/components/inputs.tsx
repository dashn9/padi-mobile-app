import React, {type ChangeEvent, useState} from 'react';
import {StyleSheet, View, TextInput, Text} from 'react-native';
import type {KeyboardTypeOptions} from 'react-native';

import * as metrics from '../metrics/metrics';
import colors from '../config/colors';
import fonts from '../config/fonts';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import icons from '../config/icons';
import AppText from './text';
interface FormInputProps {
    inputLabel?: string;
    placeholder: string;
    // Check the documentation before adding additional types for your purpose
    textContentType?: 'name' | 'emailAddress' | 'telephoneNumber' | 'password';
    keyboardType?: KeyboardTypeOptions;
    secureTextEntry?: boolean;
    onChangeText?: (e: string | ChangeEvent<any>) => void;
    error?: string;
    touched?: boolean;
}
export function FormInput({
    inputLabel,
    placeholder,
    textContentType,
    keyboardType,
    secureTextEntry = false,
    onChangeText,
    error,
    touched,
}: FormInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    // Function to toggle the password visibility state
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <View style={styles.formMaterialBody}>
            {inputLabel && (
                <AppText style={styles.formInputLabel}>{inputLabel}</AppText>
            )}
            <View style={styles.formTextInputBody}>
                <TextInput
                    autoCorrect={false}
                    secureTextEntry={secureTextEntry ?? !showPassword}
                    onChangeText={onChangeText}
                    style={styles.formTextInput}
                    placeholder={placeholder}
                    textContentType={textContentType}
                    keyboardType={keyboardType}
                    autoCapitalize='none'
                />
                {secureTextEntry && (
                    <MaterialCommunityIcons
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={icons.inputIconDimension}
                        color={colors.inputIconColor}
                        style={{marginLeft: 'auto'}}
                        onPress={toggleShowPassword}
                    />
                )}
            </View>
            {touched && error && (
                <AppText style={styles.errorText}>{error}</AppText>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    formMaterialBody: {
        marginVertical: 12,
    },
    formTextInputBody: {
        backgroundColor: colors.formInputBgColor,
        paddingVertical: metrics.verticalScale(20),
        paddingHorizontal: metrics.horizontalScale(16),
        flexDirection: 'row',
    },
    formInputLabel: {
        fontSize: fonts.formLabelFontSize,
        marginBottom: metrics.verticalScale(10),
        color: colors.formInputLabelColor,
    },
    formTextInput: {
        fontSize: fonts.formInputFontSize,
        color: colors.formInputColor,
        fontFamily: fonts.primaryFontFamily,
    },
    errorText: {
        color: 'red',
        fontSize: metrics.moderateScale(13),
    },
});
