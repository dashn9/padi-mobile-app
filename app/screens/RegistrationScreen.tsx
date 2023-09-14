import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

import { Formik } from 'formik';
import * as Yup from 'yup';

import { FormButton, FormButton2 } from '../components/buttons';
import { FormInput } from '../components/inputs';
import { Header1, Subtitle2 } from '../components/headers';
import { HaveAnAccount, UseAsGuest } from '../components/custom-links';

import regexp from '../config/regexp';

const registrationValidationSchema = Yup.object().shape({
    name: Yup.string().optional().max(50).label('Name'),
    email: Yup.string().required().email().label('E-mail'),
    phone: Yup.string().matches(regexp.phone, 'Phone Number is not valid').label("Phone Number"),
    password: Yup.string().required().min(6).label('Password')
});

function RegistrationScreen() {
    return (
        <View style={styles.mainViewContainer}>
            <Header1>
                Create Your Account
            </Header1>
            <Subtitle2>
                Kindly fill the information below to set up your account
            </Subtitle2>
            <Formik initialValues={{name:'', email:'', phone:'', password:'', }} onSubmit={values => console.log(values)} validationSchema={registrationValidationSchema}>
                {({handleChange, handleSubmit, errors, touched, setFieldTouched}) => {
                    return (
                    <>
                        <View style={styles.registrationInputsContainer}>
                            <FormInput onChangeText={handleChange('name')} placeholder='Enter your name' textContentType='name' inputLabel='Full Name' error={errors.name} touched={touched.name} />
                            <FormInput onChangeText={handleChange('email')} placeholder='johndoe@gmail.com' textContentType='emailAddress' keyboardType='email-address' inputLabel='E-mail' error={errors.email} touched={touched.email} />
                            <FormInput onChangeText={handleChange('phone')} placeholder='+2349000000000' textContentType='telephoneNumber' keyboardType='phone-pad' inputLabel='Phone Number' error={errors.phone} touched={touched.phone}/>
                            <FormInput onChangeText={handleChange('password')} placeholder='******' textContentType='password' secureTextEntry inputLabel='Create Password' error={errors.password} touched={touched.password} />
                        </View>
                        <View style={styles.registrationTriggersContainer}>
                            <FormButton text="Sign Up" onPress={handleSubmit}/>
                            <FormButton2 text="Sign in with Google" iconName='google'/>
                        </View>
                        <HaveAnAccount />
                        <UseAsGuest />
                    </>
                )}}
            </Formik>
        </View>
    );
}


const styles = StyleSheet.create({
    mainViewContainer: {
        flex: 1,
        width: '85%',
    },
    registrationInputsContainer: {
        marginTop: 32,
    },
    registrationTriggersContainer: {
        justifyContent: 'space-evenly',
        alignItems: 'stretch',
    },

});

export default RegistrationScreen;
