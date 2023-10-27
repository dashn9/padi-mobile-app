import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {type StackNavigationProp} from '@react-navigation/stack';
import {type AuthStackList} from '../../navigations/AuthNavigator';

import {Formik} from 'formik';
import * as Yup from 'yup';

import Screen from '../../components/screen';
import * as metrics from '../../utils/metrics';
import {FormButton} from '../../components/buttons';
import {FormInput} from '../../components/inputs';
import {Header1, Subtitle2} from '../../components/headers';
import {HaveAnAccount, UseAsGuest} from '../../components/custom-links';

import {Back} from '../../navigations/controls';

const resetPasswordValidationSchema = Yup.object().shape({
    password: Yup.string().required().min(6).label('Password'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm Password is required'),
});

function ResetPasswordScreen() {
    const navigator = useNavigation<StackNavigationProp<AuthStackList>>();
    return (
        <Screen>
            <Back />
            <View style={styles.mainViewContainer}>
                <Header1>Create New Password</Header1>
                <Subtitle2>Enter a new password to proceed.</Subtitle2>
                <Formik
                    initialValues={{
                        password: '',
                        confirmPassword: '',
                    }}
                    onSubmit={values => {
                        console.log(values);
                        navigator.navigate('HomeScreen');
                    }}
                    validationSchema={resetPasswordValidationSchema}
                >
                    {({handleChange, handleSubmit, errors, touched}) => (
                        <>
                            <View style={styles.resetPasswordInputsContainer}>
                                <FormInput onChangeText={handleChange('password')} placeholder='******' textContentType='password' secureTextEntry inputLabel='Create New Password' error={errors.password} touched={touched.password} />
                                <FormInput onChangeText={handleChange('confirmPassword')} placeholder='******' textContentType='password' secureTextEntry inputLabel='Confirm Password' error={errors.confirmPassword} touched={touched.confirmPassword} />
                            </View>
                            <View style={styles.resetPasswordTriggersContainer}>
                                <FormButton text='Proceed' onPress={handleSubmit} />
                            </View>
                            <HaveAnAccount />
                            <UseAsGuest />
                        </>
                    )}
                </Formik>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    mainViewContainer: {
        flex: 1,
        width: '85%',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    resetPasswordInputsContainer: {
        marginTop: metrics.verticalScale(32),
    },
    resetPasswordTriggersContainer: {
        justifyContent: 'space-evenly',
        alignItems: 'stretch',
    },
});

export default ResetPasswordScreen;
