import React from 'react';
import {StyleSheet, View} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {type StackNavigationProp} from '@react-navigation/stack';
import {type AuthStackList} from '../../navigations/AuthNavigator';

import {Formik} from 'formik';
import * as Yup from 'yup';

import Screen from '../../components/screen';
import * as metrics from '../../metrics/metrics';
import {FormButton} from '../../components/buttons';
import {FormInput} from '../../components/inputs';
import {Header1, Subtitle2} from '../../components/headers';
import {UseAsGuest} from '../../components/custom-links';
import {Back} from '../../navigations/controls';

const forgotPasswordValidationSchema = Yup.object().shape({
    email: Yup.string().required().email().label('E-mail'),
});

function ForgotPasswordScreen() {
    const navigator = useNavigation<StackNavigationProp<AuthStackList>>();
    return (
        <Screen>
            <Back />
            <View style={styles.mainViewContainer}>
                <Header1>Forgot Password</Header1>
                <Subtitle2>Please enter your E-mail address to reset password</Subtitle2>
                <Formik
                    initialValues={{
                        email: '',
                    }}
                    onSubmit={values => {
                        console.log(values);
                        navigator.navigate('OtpCodeScreen', {
                            context: 'password-reset',
                            email: values.email,
                        });
                    }}
                    validationSchema={forgotPasswordValidationSchema}
                >
                    {({handleChange, handleSubmit, errors, touched}) => (
                        <>
                            <View style={styles.forgotPasswordInputsContainer}>
                                <FormInput onChangeText={handleChange('email')} placeholder='johndoe@gmail.com' textContentType='emailAddress' keyboardType='email-address' inputLabel='E-mail' error={errors.email} touched={touched.email} />
                            </View>
                            <View style={styles.forgotPasswordTriggersContainer}>
                                <FormButton text='Proceed' onPress={handleSubmit} />
                            </View>
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
    forgotPasswordInputsContainer: {
        marginTop: metrics.verticalScale(32),
    },
    forgotPasswordTriggersContainer: {
        justifyContent: 'space-evenly',
        alignItems: 'stretch',
    },
});

export default ForgotPasswordScreen;
