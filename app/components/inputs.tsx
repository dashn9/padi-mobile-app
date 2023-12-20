import React, {type ChangeEvent, useState, useEffect} from 'react';
import {StyleSheet, View, TextInput, Pressable} from 'react-native';
import type {KeyboardTypeOptions, ViewStyle} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import {AntDesign, MaterialCommunityIcons} from '@expo/vector-icons';

import * as metrics from '../utils/metrics';
import colors from '../config/colors';
import fonts from '../config/fonts';
import icons from '../config/icons';
import AppText from './text';
import {formatDateToString} from '../utils/datetime';
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

interface FormTextAreaProps extends FormInputProps {
    outText?: string;
    maxLength?: number;
}

const parseError = (error: string | string[]) => {
    const errors: React.ReactElement[] = [];
    if (Array.isArray(error)) {
        error.reduce((prev, curr, index) => {
            prev.push(
                <AppText key={index} style={styles.errorText}>
                    {curr}
                </AppText>
            );
            return prev;
        }, errors);
    } else {
        errors.push(
            <AppText key={0} style={styles.errorText}>
                {error}
            </AppText>
        );
    }

    return errors;
};

export function FormTextArea({
    outText,
    inputLabel,
    placeholder,
    onChangeText,
    error,
    touched,
    inputContainerStyle,
    inputBoxStyle,
    maxLength = 500, // Set a default max length (adjust as needed)
}: FormTextAreaProps) {
    const [text, setText] = useState('');

    useEffect(() => {
        if (outText) {
            setText(outText);
        }
    }, [outText]);

    const handleTextChange = (newText: string) => {
        if (newText.length <= maxLength) {
            setText(newText);
            if (onChangeText) {
                onChangeText(newText);
            }
        }
    };

    return (
        <View style={[styles.formMaterialBody, inputContainerStyle]}>
            {inputLabel && <AppText style={styles.formInputLabel}>{inputLabel}</AppText>}
            <View style={[styles.formTextInputBody, inputBoxStyle]}>
                <TextInput
                    multiline
                    numberOfLines={5} // You can adjust the number of lines as needed
                    autoCorrect={false}
                    onChangeText={handleTextChange}
                    style={styles.formTextInput}
                    placeholder={placeholder}
                    value={text}
                />
            </View>
            <View style={styles.characterCountContainer}>
                <AppText style={styles.characterCountText}>
                    {text.length}/{maxLength}
                </AppText>
            </View>
            {touched && error && parseError(error)}
        </View>
    );
}

export function FormInput({inputLabel, placeholder, textContentType, keyboardType, secureTextEntry = false, onChangeText, error, touched, inputContainerStyle, inputBoxStyle}: FormInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    // Function to toggle the password visibility state
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <View style={[styles.formMaterialBody, inputContainerStyle]}>
            {inputLabel && <AppText style={styles.formInputLabel}>{inputLabel}</AppText>}
            <View style={[styles.formTextInputBody, inputBoxStyle]}>
                <TextInput autoCorrect={false} secureTextEntry={secureTextEntry && !showPassword} onChangeText={onChangeText} style={styles.formTextInput} placeholder={placeholder} textContentType={textContentType} keyboardType={keyboardType} autoCapitalize='none' />
                {secureTextEntry && <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={icons.l} color={colors.inputIconColor} style={{marginLeft: 'auto'}} onPress={toggleShowPassword} />}
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
    return <DropDownPicker open={open} setOpen={setOpen} style={styles.searchableDropDownContainer} dropDownContainerStyle={styles.searchableDropDown} listItemContainerStyle={styles.searchableDropDownListItemParentContainer} searchTextInputStyle={styles.searchableDropDownSearchInput} selectedItemContainerStyle={styles.searchableDropDownSelectedItemContainerStyle} selectedItemLabelStyle={styles.searchableDropDownSelectedItemLabelContainerStyle} items={stateItems} value={value} setValue={setValue} setItems={setItems} placeholder={placeholder} placeholderStyle={styles.dropDownPlaceholderStyle} activityIndicatorColor='#5188E3' searchable={true} searchPlaceholder={searchPlaceholder} />;
}

interface DatePickerProps {
    mode: 'date' | 'datetime' | 'time';
    maximumDate?: Date;
    onUpdate?: (date: Date | string) => void;
    parseToString?: boolean;
    inputContainerStyle?: ViewStyle;
}

export function DatePickerCustom({inputContainerStyle, mode, onUpdate, parseToString, maximumDate}: DatePickerProps) {
    const [date, setDate] = useState(new Date('2000-01-01'));
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    useEffect(() => {
        if (onUpdate) {
            onUpdate(parseToString ? formatDateToString(date) : date);
        }
    }, [date]);
    return (
        <View style={[styles.formMaterialBody, inputContainerStyle]}>
            <Pressable
                onPress={() => {
                    setDatePickerOpen(true);
                }}
            >
                <View style={styles.formTextInputBody}>
                    <AppText>{parseToString ? formatDateToString(date) : 'Select Date'}</AppText>

                    <DatePicker
                        modal
                        maximumDate={maximumDate}
                        open={datePickerOpen}
                        date={date}
                        onConfirm={date => {
                            setDatePickerOpen(false);
                            setDate(date);
                        }}
                        onCancel={() => {
                            setDatePickerOpen(false);
                        }}
                        mode={mode}
                    />
                    <MaterialCommunityIcons name='calendar' size={icons.l} color={colors.inputIconColor} style={{marginLeft: 'auto'}} />
                </View>
            </Pressable>
        </View>
    );
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
        marginTop: metrics.verticalScale(18),
        backgroundColor: colors.formInputBgColor2,
        borderWidth: 0,
        borderRadius: 8,
    },
    searchableDropDown: {
        borderWidth: 0,
        marginTop: metrics.verticalScale(24),
        shadowOffset: {width: 2, height: 2},
        shadowRadius: 4,
        shadowOpacity: 1,
        shadowColor: colors.boxShadow,
        overflow: 'visible',
    },
    searchableDropDownListItemParentContainer: {
        backgroundColor: colors.white,
    },
    searchableDropDownSearchInput: {
        borderWidth: 0,
    },
    searchableDropDownSelectedItemLabelContainerStyle: {
        color: colors.primaryColor,
    },
    searchableDropDownSelectedItemContainerStyle: {
        backgroundColor: colors.lightbgGreyColor,
    },
    dropDownPlaceholderStyle: {},

    characterCountContainer: {
        marginLeft: 'auto',
        marginTop: metrics.verticalScale(4),
    },
    characterCountText: {
        fontSize: fonts.small,
        color: colors.primaryColor600B,
    },
});
