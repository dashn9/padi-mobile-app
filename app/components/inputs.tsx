import React, {type ChangeEvent, useState, useEffect} from 'react';
import {StyleSheet, View, TextInput, Pressable} from 'react-native';
import type {KeyboardTypeOptions, ViewStyle} from 'react-native';

import * as metrics from '../utils/metrics';
import colors from '../config/colors';
import fonts from '../config/fonts';
import {AntDesign, MaterialCommunityIcons} from '@expo/vector-icons';
import icons from '../config/icons';
import AppText from './text';
import DropDownPicker from 'react-native-dropdown-picker';
interface FormInputProps {
    inputLabel?: string;
    placeholder: string;
    // Check the documentation before adding additional types for your purpose
    textContentType?: 'name' | 'emailAddress' | 'telephoneNumber' | 'password';
    keyboardType?: KeyboardTypeOptions;
    secureTextEntry?: boolean;
    onChangeText?: (e: string | ChangeEvent<any>) => void;
    error?: string | string[];
    touched?: boolean;
    inputContainerStyle?: ViewStyle;
    inputBoxStyle?: ViewStyle;
}
export function FormInput({inputLabel, placeholder, textContentType, keyboardType, secureTextEntry = false, onChangeText, error, touched, inputContainerStyle, inputBoxStyle}: FormInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    // Function to toggle the password visibility state
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const parseError = (error: string | string[]) => {
        const errors: React.ReactElement[] = [];
        if (Array.isArray(error)) {
            error.reduce((prev, curr) => {
                prev.push(<AppText style={styles.errorText}>{curr}</AppText>);
                return prev;
            }, errors);
        } else {
            errors.push(<AppText style={styles.errorText}>{error}</AppText>);
        }

        return errors;
    };

    return (
        <View style={[styles.formMaterialBody, inputContainerStyle]}>
            {inputLabel && <AppText style={styles.formInputLabel}>{inputLabel}</AppText>}
            <View style={[styles.formTextInputBody, inputBoxStyle]}>
                <TextInput autoCorrect={false} secureTextEntry={secureTextEntry && !showPassword} onChangeText={onChangeText} style={styles.formTextInput} placeholder={placeholder} textContentType={textContentType} keyboardType={keyboardType} autoCapitalize='none' />
                {secureTextEntry && <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={icons.inputIconDimension} color={colors.inputIconColor} style={{marginLeft: 'auto'}} onPress={toggleShowPassword} />}
            </View>
            {touched && error && parseError(error)}
        </View>
    );
}

interface SearchBoxProps {
    searchBoxStyle?: ViewStyle;
    onValueChange?: (value: string) => any;
    onSearchSubmit?: (value: string) => any;
}

export function SearchBox({searchBoxStyle, onValueChange, onSearchSubmit}: SearchBoxProps) {
    const [searchValue, setSearchValue] = useState<string | ChangeEvent<any>>('');

    useEffect(() => {
        if (onValueChange && typeof searchValue === 'string') {
            onValueChange(searchValue);
        }
    }, [searchValue]);
    return (
        <View style={[styles.searchBox, searchBoxStyle]}>
            <FormInput onChangeText={setSearchValue} placeholder='Enter Artisan Name' inputContainerStyle={{marginVertical: 0, width: '83%'}} inputBoxStyle={{borderWidth: 1, borderColor: colors.primaryColor, borderRadius: 8, paddingVertical: metrics.verticalScale(15)}} />
            <Pressable
                style={styles.searchButton}
                onPress={() => {
                    if (onSearchSubmit && typeof searchValue === 'string') {
                        onSearchSubmit(searchValue);
                    }
                }}
            >
                <AntDesign name='search1' size={metrics.moderateScale(28)} color='#fff' />
            </Pressable>
        </View>
    );
}

interface SearchableDropDownProps {
    items: Array<{label: string; value: string}>;
    value: string;
    setValue: (value: React.SetStateAction<string>) => void;
    placeholder: string;
    searchPlaceholder: string;
    dropDownStyle?: ViewStyle;
}

export function SearchableDropDown({items, value, setValue, placeholder, searchPlaceholder}: SearchableDropDownProps) {
    const [stateItems, setItems] = useState<any[]>(items);
    const [open, setOpen] = useState(false);
    return <DropDownPicker open={open} setOpen={setOpen} containerStyle={styles.searchableDropDownContainer} style={styles.searchableDropDown} dropDownContainerStyle={styles.searchableDropDown} searchTextInputStyle={styles.searchableDropDownSearchInput} items={stateItems} value={value} setValue={setValue} setItems={setItems} placeholder={placeholder} placeholderStyle={styles.dropDownPlaceholderStyle} activityIndicatorColor='#5188E3' searchable={true} searchPlaceholder={searchPlaceholder} />;
}

// I created this custom hook for the SearchBar, and now, I feel the need not to use it. Upgrade and use if there is need to abstract and reuse some serious logic
export function useSearch<ReturnType>(searchSubmitAction: (searchValue: string) => ReturnType) {
    const [searchValue, setSearchValue] = useState<string>('');

    const updateSearchValue = (value: string) => {
        setSearchValue(value);
    };

    const performSearch = () => searchSubmitAction(searchValue);

    return {
        searchValue,
        updateSearchValue,
        performSearch,
    };
}

const styles = StyleSheet.create({
    formMaterialBody: {
        marginVertical: metrics.verticalScale(12),
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
        width: '95%',
    },
    errorText: {
        color: 'red',
        fontSize: metrics.moderateScale(13),
    },

    // Search Box
    searchBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: metrics.verticalScale(18),
    },
    searchButton: {
        backgroundColor: '#3266FA',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 'auto',
        alignSelf: 'flex-end',
        padding: metrics.verticalScale(12),
        borderRadius: 12,
    },

    // Drop Downs
    searchableDropDownContainer: {
        width: '48%',
        marginTop: metrics.verticalScale(18),
    },
    searchableDropDown: {
        borderWidth: 0,
        backgroundColor: colors.formInputBgColor2,
        borderRadius: 14,
    },
    searchableDropDownSearchInput: {
        borderColor: colors.primaryColor,
    },
    dropDownPlaceholderStyle: {},
});
