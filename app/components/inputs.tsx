import React, { ChangeEvent } from 'react';
import { StyleSheet, View, TextInput, Text } from 'react-native';
import type { KeyboardTypeOptions } from 'react-native';

import colors from '../config/colors';
import fonts from '../config/fonts';
interface FormInputProps {
    inputLabel?: string;
    placeholder: string;
    // Check the documentation before adding additional types for your purpose
    textContentType?: "name" | "emailAddress" | "telephoneNumber" | "password";
    keyboardType?: KeyboardTypeOptions;
    secureTextEntry?: boolean
    onChangeText?: (e: string | ChangeEvent<any>) => void
    error?: string
    touched?: boolean
}
export function FormInput({inputLabel, placeholder, textContentType, keyboardType, secureTextEntry=false, onChangeText, error, touched}: FormInputProps) {
    return (
        <View style={styles.formMaterialBody}>
            {inputLabel && <Text style={styles.formInputLabel}>{inputLabel}</Text>}
            <View style={styles.formTextInputBody}>
                <TextInput autoCorrect={false} secureTextEntry={secureTextEntry} onChangeText={onChangeText} style={styles.formTextInput} placeholder={placeholder} textContentType={textContentType} keyboardType={keyboardType} autoCapitalize='none' />
            </View>
            {touched && error && <Text style={styles.errorText} >{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    formMaterialBody: {
        marginVertical: 12,
    },
    formTextInputBody: {
        backgroundColor: colors.formInputBGColor,
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    formInputLabel: {
        fontSize: fonts.formLabelFontSize,
        marginBottom: 10,
        color: colors.formInputLabelColor
    },
    formTextInput: {
        fontSize: fonts.formInputFontSize,
        color: colors.formInputColor,
    },
    errorText: {
        color: 'red',
        fontSize: 13,
    }
})
