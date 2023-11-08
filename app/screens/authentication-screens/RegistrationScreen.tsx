import React, {useState} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {type StackNavigationProp} from '@react-navigation/stack';

import {Formik} from 'formik';
import * as Yup from 'yup';

import {type AuthStackList} from '../../navigations/AuthNavigator';
import Screen from '../../components/screen';
import * as metrics from '../../utils/metrics';
import {FormButton, FormButton2} from '../../components/buttons';
import {FormInput} from '../../components/inputs';
import {Header1, Subtitle2} from '../../components/headers';
import {HaveAnAccount} from '../../components/custom-links';
import useAuth from '../../hooks/useAuth';

import regexp from '../../config/regexp';
import Message, {useMessage} from '../../components/messages';

const registrationValidationSchema = Yup.object().shape({
    // It had to be declared this way to maintain consistency between server fields requirements
    // eslint-disable-next-line @typescript-eslint/naming-convention
    full_name: Yup.string().required().max(50).label('Full Name'),
    email: Yup.string().required().email().label('E-mail'),
    phone: Yup.string().matches(regexp.phone, 'Phone Number is not valid').label('Phone Number'),
    password: Yup.string().required().min(8).label('Password'),
});

function RegistrationScreen() {
    const [isNativeRegistrationApiLoading, setNativeRegistrationApiLoading] = useState(false);
    const {isVisible, message, messageStatus, showMessage, hideMessage} = useMessage();
    const navigator = useNavigation<StackNavigationProp<AuthStackList>>();
    const {nativeRegister, generateOtp} = useAuth();
    return (
        <Screen>
            <ScrollView style={{width: '100%'}} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} alwaysBounceVertical={false}>
                <View style={styles.mainViewContainer}>
                    <Message message={message} status={messageStatus} isVisible={isVisible} onHide={hideMessage} />
                    <Header1>Create Your Account</Header1>
                    <Subtitle2>Kindly fill the information below to set up your account</Subtitle2>
                    <Formik
                        initialValues={{
                            // It has to be disabled because that's the the full_name parameter for registration
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            full_name: '',
                            email: '',
                            phone: '',
                            password: '',
                        }}
                        onSubmit={async (values, {setErrors}) => {
                            setNativeRegistrationApiLoading(true);
                            const registrationInfo = await nativeRegister(values);
                            setNativeRegistrationApiLoading(false);

                            if (registrationInfo) {
                                const responseData = registrationInfo[1];
                                if (registrationInfo[0] === 'error') {
                                    setErrors(responseData);
                                    // You can find more edge cases to manually display in the message and make this the last case scenario
                                    // Check if any errorin the acceptable errors to display for form fields.
                                    const acceptableErrorsToDispForField = ['full_name', 'email', 'phone', 'password'];
                                    console.log(responseData);
                                    if (Object.keys(responseData).some(val => !acceptableErrorsToDispForField.includes(val))) {
                                        showMessage('Server error occurred!', 'failure');
                                    }
                                } else if (registrationInfo[0] === 'success') {
                                    showMessage(`Welcome! ${responseData.first_name}`, 'success');
                                    try {
                                        setNativeRegistrationApiLoading(true);
                                        await generateOtp({email: values.email});
                                        setNativeRegistrationApiLoading(false);
                                        setTimeout(() => {
                                            navigator.navigate('OtpCodeScreen', {
                                                context: 'email-verification',
                                                email: values.email,
                                                password: values.password,
                                            });
                                        }, 2000);
                                    } catch {
                                        showMessage('OTP can&apos;t be generated', 'failure');
                                    }
                                }
                            }
                        }}
                        validationSchema={registrationValidationSchema}
                    >
                        {({handleChange, handleSubmit, errors, touched}) => (
                            <>
                                <View style={styles.registrationInputsContainer}>
                                    <FormInput onChangeText={handleChange('full_name')} placeholder='Enter your first and last name' textContentType='name' inputLabel='Full Name' error={errors.full_name} touched={touched.full_name} />
                                    <FormInput onChangeText={handleChange('email')} placeholder='johndoe@gmail.com' textContentType='emailAddress' keyboardType='email-address' inputLabel='E-mail' error={errors.email} touched={touched.email} />
                                    <FormInput onChangeText={handleChange('phone')} placeholder='+2349000000000' textContentType='telephoneNumber' keyboardType='phone-pad' inputLabel='Phone Number' error={errors.phone} touched={touched.phone} />
                                    <FormInput onChangeText={handleChange('password')} placeholder='******' textContentType='password' secureTextEntry inputLabel='Create Password' error={errors.password} touched={touched.password} />
                                </View>
                                <View style={styles.registrationTriggersContainer}>
                                    <FormButton text='Sign Up' onPress={handleSubmit} isApiLoading={isNativeRegistrationApiLoading} />
                                    <FormButton2 text='Sign in with Google' iconName='google' />
                                </View>
                                <HaveAnAccount />
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
    registrationInputsContainer: {
        marginTop: metrics.verticalScale(32),
    },
    registrationTriggersContainer: {
        justifyContent: 'space-evenly',
        alignItems: 'stretch',
    },
});

export default RegistrationScreen;
