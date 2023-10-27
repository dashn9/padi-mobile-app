import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {type StackNavigationProp} from '@react-navigation/stack';

import {Formik} from 'formik';
import * as Yup from 'yup';

import Screen from '../../components/screen';
import * as metrics from '../../utils/metrics';
import {FormButton, FormButton2} from '../../components/buttons';
import {FormInput} from '../../components/inputs';
import type {AuthStackList} from '../../navigations/AuthNavigator';
import {Header1, Subtitle2} from '../../components/headers';
import {DonotHaveAnAccount, ForgotPassword, UseAsGuest} from '../../components/custom-links';
import Message, {useMessage} from '../../components/messages';

const loginValidationSchema = Yup.object().shape({
    email: Yup.string().required().email().label('E-mail'),
    password: Yup.string().required().label('Password'),
});

function LoginScreen() {
    const navigator = useNavigation<StackNavigationProp<AuthStackList>>();

    const {isVisible, message, messageStatus, showMessage, hideMessage} = useMessage();
    return (
        <Screen>
            <ScrollView style={{width: '100%'}} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} alwaysBounceVertical={false}>
                <View style={styles.mainViewContainer}>
                    <Message message={message} status={messageStatus} isVisible={isVisible} onHide={hideMessage} />
                    <Header1
                        style={{
                            marginBottom: metrics.verticalScale(32),
                        }}
                    >
                        Padi(Logo)
                    </Header1>
                    <Subtitle2>Welcome back!</Subtitle2>
                    <Header1 style={{marginTop: metrics.verticalScale(8)}}>Log into Your Account</Header1>
                    <Formik
                        initialValues={{
                            email: '',
                            password: '',
                        }}
                        onSubmit={values => {
                            console.log(values);
                            navigator.navigate('OtpCodeScreen', {
                                context: 'two-factor-authentication',
                                email: values.email,
                            });
                        }}
                        validationSchema={loginValidationSchema}
                    >
                        {({handleChange, handleSubmit, errors, touched}) => (
                            <>
                                <View style={styles.loginInputsContainer}>
                                    <FormInput onChangeText={handleChange('email')} placeholder='johndoe@gmail.com' textContentType='emailAddress' keyboardType='email-address' inputLabel='E-mail' error={errors.email} touched={touched.email} />
                                    <FormInput onChangeText={handleChange('password')} placeholder='******' textContentType='password' secureTextEntry inputLabel='Password' error={errors.password} touched={touched.password} />
                                </View>
                                <ForgotPassword />
                                <View style={styles.loginTriggersContainer}>
                                    <FormButton text='Sign In' onPress={handleSubmit} />
                                    <FormButton2 text='Sign in with Google' iconName='google' />
                                </View>
                                <DonotHaveAnAccount />
                            </>
                        )}
                    </Formik>
                </View>
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    mainViewContainer: {
        flex: 1,
        width: '85%',
        alignSelf: 'center',
    },
    loginInputsContainer: {
        marginTop: metrics.verticalScale(32),
    },
    loginTriggersContainer: {
        justifyContent: 'space-evenly',
        alignItems: 'stretch',
    },
});

export default LoginScreen;
